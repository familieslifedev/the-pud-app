<?php
$id=$_GET['id']??'';
if (!is_string($id) || !preg_match('/^[a-f0-9]{32}\.(jpg|png|webp|gif)$/',$id)) { http_response_code(404); exit; }
$file=dirname(__DIR__).'/storage/uploads/'.$id;
if (!is_file($file)) { http_response_code(404); exit; }
$types=['jpg'=>'image/jpeg','png'=>'image/png','webp'=>'image/webp','gif'=>'image/gif'];
header('Content-Type: '.$types[pathinfo($id,PATHINFO_EXTENSION)]);
header('X-Content-Type-Options: nosniff');
header('Content-Security-Policy: sandbox');
header('Cache-Control: private, max-age=3600');
readfile($file);
