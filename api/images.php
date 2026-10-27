<?php
declare(strict_types=1);
session_start();
if (empty($_SESSION['pud_csrf'])) $_SESSION['pud_csrf'] = bin2hex(random_bytes(32));
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
$dir = dirname(__DIR__) . '/storage/uploads';
if (!is_dir($dir)) mkdir($dir, 0700, true);
function fail(string $message, int $status = 400): never { http_response_code($status); echo json_encode(['error'=>$message]); exit; }
function inventory(string $dir): array {
  $out=[];
  foreach (glob($dir . '/*') ?: [] as $file) {
    if (!is_file($file) || !preg_match('/^[a-f0-9]{32}\.(jpg|png|webp|gif)$/', basename($file))) continue;
    $out[]=['id'=>basename($file), 'url'=>'/api/image.php?id='.rawurlencode(basename($file)), 'added'=>filemtime($file)];
  }
  usort($out, fn($a,$b)=>$a['added'] <=> $b['added']);
  return $out;
}
if ($_SERVER['REQUEST_METHOD']==='GET') { echo json_encode(['images'=>inventory($dir),'csrf'=>$_SESSION['pud_csrf'] ?? null]); exit; }
if (!is_string($_SERVER['HTTP_X_CSRF_TOKEN'] ?? null) || !hash_equals($_SESSION['pud_csrf'], $_SERVER['HTTP_X_CSRF_TOKEN'])) fail('Invalid session token',403);
if ($_SERVER['REQUEST_METHOD']==='POST') {
  if (empty($_FILES['images'])) fail('No images supplied');
  $files=$_FILES['images']; $results=[]; $errors=[];
  $types=['image/jpeg'=>'jpg','image/png'=>'png','image/webp'=>'webp','image/gif'=>'gif'];
  $finfo=new finfo(FILEINFO_MIME_TYPE);
  foreach ((array)$files['name'] as $i=>$original) {
    $err=$files['error'][$i]; $size=$files['size'][$i]; $tmp=$files['tmp_name'][$i];
    if ($err!==UPLOAD_ERR_OK || $size<=0 || $size>8*1024*1024 || !is_uploaded_file($tmp)) { $errors[]=$original.': upload failed or exceeds 8 MB'; continue; }
    $mime=$finfo->file($tmp);
    if (!isset($types[$mime]) || @getimagesize($tmp)===false) { $errors[]=$original.': unsupported image'; continue; }
    $id=bin2hex(random_bytes(16)).'.'.$types[$mime];
    if (!move_uploaded_file($tmp,$dir.'/'.$id)) { $errors[]=$original.': could not save'; continue; }
    chmod($dir.'/'.$id,0600); $results[]=$id;
  }
  echo json_encode(['uploaded'=>$results,'errors'=>$errors,'images'=>inventory($dir)]); exit;
}
if ($_SERVER['REQUEST_METHOD']==='DELETE') {
  $body=json_decode(file_get_contents('php://input'),true);
  $id=$body['id']??'';
  if (!is_string($id) || !preg_match('/^[a-f0-9]{32}\.(jpg|png|webp|gif)$/',$id)) fail('Invalid image ID');
  if (!is_file($dir.'/'.$id)) fail('Image not found',404);
  if (!unlink($dir.'/'.$id)) fail('Could not delete',500);
  echo json_encode(['images'=>inventory($dir)]); exit;
}
fail('Method not allowed',405);
