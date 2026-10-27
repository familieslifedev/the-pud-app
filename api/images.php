<?php
declare(strict_types=1);
require_once dirname(__DIR__).'/lib/media.php';
session_start();
if (empty($_SESSION['pud_csrf'])) $_SESSION['pud_csrf']=bin2hex(random_bytes(32));
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
function media_fail(string $message,int $code=400): never {http_response_code($code);echo json_encode(['error'=>$message]);exit;}
try {
 $dir=dirname(__DIR__).'/storage/uploads';
 if (!is_dir($dir) && !mkdir($dir,0700,true) && !is_dir($dir)) throw new RuntimeException('Upload directory unavailable');
 $db=pud_media_db();
 pud_media_sync($db,$dir);
 $method=$_SERVER['REQUEST_METHOD']??'GET';
 if ($method==='GET') {echo json_encode(['images'=>pud_media_inventory($db),'csrf'=>$_SESSION['pud_csrf']]);exit;}
 if (!in_array($method,['POST','PATCH','DELETE'],true)) media_fail('Method not allowed',405);
 if (!hash_equals($_SESSION['pud_csrf'],(string)($_SERVER['HTTP_X_CSRF_TOKEN']??''))) media_fail('Invalid session token',403);
 if ($method==='POST') {
  if (empty($_FILES['images'])) media_fail('No images supplied');
  $files=$_FILES['images'];$results=[];$errors=[];
  $types=['image/jpeg'=>'jpg','image/png'=>'png','image/webp'=>'webp','image/gif'=>'gif'];
  $finfo=new finfo(FILEINFO_MIME_TYPE);
  foreach ((array)$files['name'] as $i=>$original) {
   $err=$files['error'][$i]??UPLOAD_ERR_NO_FILE;$size=$files['size'][$i]??0;$tmp=$files['tmp_name'][$i]??'';
   if ($err!==UPLOAD_ERR_OK || $size<=0 || $size>8*1024*1024 || !is_uploaded_file($tmp)) {$errors[]=$original.': upload failed or exceeds 8 MB';continue;}
   $mime=$finfo->file($tmp);
   if (!isset($types[$mime]) || @getimagesize($tmp)===false) {$errors[]=$original.': unsupported image';continue;}
   $id=bin2hex(random_bytes(16)).'.'.$types[$mime];
   if (!move_uploaded_file($tmp,$dir.'/'.$id)) {$errors[]=$original.': could not save';continue;}
   chmod($dir.'/'.$id,0600);
   try {
    $next=(int)$db->query('SELECT COALESCE(MAX(sort_order),-1)+1 FROM media')->fetchColumn();
    $stmt=$db->prepare('INSERT INTO media(id,filename,caption,sort_order,created_at,mime_type) VALUES(?,?,?,?,?,?)');
    $stmt->execute([$id,$id,'',$next,time(),$mime]);$results[]=$id;
   } catch(Throwable $e) {unlink($dir.'/'.$id);throw $e;}
  }
  echo json_encode(['uploaded'=>$results,'errors'=>$errors,'images'=>pud_media_inventory($db)]);exit;
 }
 $body=json_decode(file_get_contents('php://input'),true);
 if (!is_array($body)) media_fail('Expected JSON object');
 $id=$body['id']??null;
 if (!is_string($id) || !preg_match('/^[a-f0-9]{32}\.(jpg|png|webp|gif)$/',$id)) media_fail('Invalid image ID');
 $stmt=$db->prepare('SELECT 1 FROM media WHERE id=?');$stmt->execute([$id]);
 if (!$stmt->fetchColumn()) media_fail('Image not found',404);
 if ($method==='PATCH') {
  if (array_key_exists('caption',$body)) {
   if (!is_string($body['caption']) || mb_strlen($body['caption'])>200) media_fail('Caption must be at most 200 characters');
   $stmt=$db->prepare('UPDATE media SET caption=? WHERE id=?');$stmt->execute([$body['caption'],$id]);
  }
  if (array_key_exists('order',$body)) {
   if (!is_int($body['order']) || $body['order']<0 || $body['order']>1000000) media_fail('Invalid order');
   $stmt=$db->prepare('UPDATE media SET sort_order=? WHERE id=?');$stmt->execute([$body['order'],$id]);
  }
  echo json_encode(['images'=>pud_media_inventory($db)]);exit;
 }
 // Rename first so a failed filesystem operation never deletes the database record.
 $file=$dir.'/'.$id;$temporary=$dir.'/.deleting-'.$id;
 if (!is_file($file) || !rename($file,$temporary)) media_fail('Could not remove image',500);
 try {$stmt=$db->prepare('DELETE FROM media WHERE id=?');$stmt->execute([$id]);unlink($temporary);} catch(Throwable $e) {rename($temporary,$file);throw $e;}
 echo json_encode(['images'=>pud_media_inventory($db)]);
} catch(Throwable $e) {error_log($e->getMessage());media_fail('Media operation failed',500);}
