<?php
declare(strict_types=1);
function pud_db(): PDO {
 static $db = null;
 if ($db) return $db;
 $folder = dirname(__DIR__) . '/storage';
 if (!is_dir($folder) && !mkdir($folder, 0700, true) && !is_dir($folder)) throw new RuntimeException('Cannot create storage directory');
 $db = new PDO('sqlite:' . $folder . '/pud.sqlite');
 $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
 $db->exec('PRAGMA busy_timeout=5000; PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL;');
 $db->beginTransaction();
 try {
  $db->exec('CREATE TABLE IF NOT EXISTS app_snapshot (id INTEGER PRIMARY KEY CHECK(id=1), payload TEXT NOT NULL, updated_at TEXT NOT NULL)');
  $db->exec('CREATE TABLE IF NOT EXISTS schema_migrations (version INTEGER PRIMARY KEY, applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)');
  $version=(int)$db->query('SELECT COALESCE(MAX(version),0) FROM schema_migrations')->fetchColumn();
  if ($version<1) {
   $db->exec('CREATE TABLE IF NOT EXISTS achievements (achievement_id TEXT PRIMARY KEY, unlocked_at TEXT NULL)');
   $db->exec('CREATE TABLE IF NOT EXISTS mission_logs (id INTEGER PRIMARY KEY AUTOINCREMENT, position INTEGER NOT NULL UNIQUE, entry_text TEXT NOT NULL, entry_date TEXT NOT NULL)');
   $db->exec('CREATE TABLE IF NOT EXISTS settings (setting_key TEXT PRIMARY KEY, value_json TEXT NOT NULL)');
   $old=$db->query('SELECT payload FROM app_snapshot WHERE id=1')->fetchColumn();
   if ($old!==false) {
    $data=json_decode($old,true,512,JSON_THROW_ON_ERROR);
    if (is_array($data)) pud_sync_relational($db,$data);
   }
   $db->exec('INSERT INTO schema_migrations(version) VALUES(1)');
  }
  $db->commit();
 } catch (Throwable $e) { $db->rollBack(); throw $e; }
 return $db;
}
/** Synchronise the relational tables with the legacy JSON contract, atomically. */
function pud_sync_relational(PDO $db,array $data): void {
 $db->exec('DELETE FROM achievements');
 $stmt=$db->prepare('INSERT INTO achievements(achievement_id,unlocked_at) VALUES(?,NULL)');
 foreach (array_unique($data['unlockedAchievements']??[]) as $id) $stmt->execute([$id]);
 $db->exec('DELETE FROM mission_logs');
 $stmt=$db->prepare('INSERT INTO mission_logs(position,entry_text,entry_date) VALUES(?,?,?)');
 foreach (($data['missionLogs']??[]) as $i=>$entry) $stmt->execute([$i,$entry['text'],$entry['date']]);
 $db->exec('DELETE FROM settings');
 $stmt=$db->prepare('INSERT INTO settings(setting_key,value_json) VALUES(?,?)');
 foreach (($data['settings']??[]) as $key=>$value) $stmt->execute([$key,json_encode($value,JSON_THROW_ON_ERROR)]);
}
