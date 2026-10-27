<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
$dir=dirname(__DIR__).'/assets/images/pud';
$images=[];
foreach (glob($dir.'/*') ?: [] as $file) {
 if (!is_file($file) || !preg_match('/\.(jpe?g|png|webp|gif)$/i',basename($file))) continue;
 $images[]=['id'=>'bundled:'.basename($file),'url'=>'/assets/images/pud/'.rawurlencode(basename($file))];
}
usort($images,fn($a,$b)=>strnatcasecmp($a['id'],$b['id']));
echo json_encode(['images'=>$images]);
