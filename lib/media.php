<?php
declare(strict_types=1);
require_once __DIR__.'/db.php';
function pud_media_db(): PDO {
 $db=pud_db();
 $db->exec('CREATE TABLE IF NOT EXISTS media (id TEXT PRIMARY KEY, filename TEXT NOT NULL UNIQUE, caption TEXT NOT NULL DEFAULT \'\', sort_order INTEGER NOT NULL DEFAULT 0, created_at INTEGER NOT NULL, mime_type TEXT NOT NULL)');
 $db->exec('CREATE INDEX IF NOT EXISTS media_order_idx ON media(sort_order,created_at,id)');
 return $db;
}
function pud_media_sync(PDO $db,string $dir): void {
 $insert=$db->prepare('INSERT OR IGNORE INTO media(id,filename,caption,sort_order,created_at,mime_type) VALUES(?,?,?,?,?,?)');
 $max=(int)$db->query('SELECT COALESCE(MAX(sort_order),-1) FROM media')->fetchColumn();
 $types=['jpg'=>'image/jpeg','png'=>'image/png','webp'=>'image/webp','gif'=>'image/gif'];
 foreach (glob($dir.'/*') ?: [] as $file) {
  $name=basename($file);
  if (!is_file($file) || !preg_match('/^[a-f0-9]{32}\.(jpg|png|webp|gif)$/',$name)) continue;
  $exists=$db->prepare('SELECT 1 FROM media WHERE id=?'); $exists->execute([$name]);
  if ($exists->fetchColumn()) continue;
  $max++; $insert->execute([$name,$name,'',$max,filemtime($file) ?: time(),$types[pathinfo($name,PATHINFO_EXTENSION)]]);
 }
 // If files were removed outside the application, remove their stale records.
 $ids=$db->query('SELECT id FROM media')->fetchAll(PDO::FETCH_COLUMN);
 $delete=$db->prepare('DELETE FROM media WHERE id=?');
 foreach ($ids as $id) if (!is_file($dir.'/'.$id)) $delete->execute([$id]);
}
function pud_media_inventory(PDO $db): array {
 $rows=$db->query('SELECT id,caption,sort_order,created_at,mime_type FROM media ORDER BY sort_order,created_at,id')->fetchAll(PDO::FETCH_ASSOC);
 return array_map(static fn($r)=>['id'=>$r['id'],'url'=>'/api/image.php?id='.rawurlencode($r['id']),'caption'=>$r['caption'],'order'=>(int)$r['sort_order'],'added'=>(int)$r['created_at']],$rows);
}
