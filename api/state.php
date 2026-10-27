<?php
declare(strict_types=1);
require_once dirname(__DIR__) . '/lib/db.php';
session_start();
if (empty($_SESSION['pud_csrf'])) $_SESSION['pud_csrf'] = bin2hex(random_bytes(32));
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
function reply(int $code, array $body): never { http_response_code($code); echo json_encode($body, JSON_UNESCAPED_UNICODE); exit; }
try {
 $db=pud_db();
 $method=$_SERVER['REQUEST_METHOD'];
 if ($method==='GET') {
  $payload=$db->query('SELECT payload FROM app_snapshot WHERE id=1')->fetchColumn();
  reply(200,['data'=>$payload===false?null:json_decode($payload,true),'csrf'=>$_SESSION['pud_csrf']]);
 }
 if (!in_array($method,['PUT','DELETE'],true)) reply(405,['error'=>'Method not allowed']);
 if (!hash_equals($_SESSION['pud_csrf'],(string)($_SERVER['HTTP_X_CSRF_TOKEN']??''))) reply(403,['error'=>'Invalid session token']);
 if ($method==='DELETE') { $db->beginTransaction(); try { $db->exec('DELETE FROM app_snapshot WHERE id=1'); $db->exec('DELETE FROM achievements'); $db->exec('DELETE FROM mission_logs'); $db->exec('DELETE FROM settings'); $db->commit(); } catch (Throwable $e) { $db->rollBack(); throw $e; } reply(200,['ok'=>true]); }
 $raw=file_get_contents('php://input');
 if (strlen($raw)>1048576) reply(413,['error'=>'State exceeds 1 MB']);
 $data=json_decode($raw,true);
 if (!is_array($data) || array_is_list($data)) reply(400,['error'=>'Expected JSON object']);
 $numeric=['bugs','meetings','caffeine','approval','weatherBonus','uptimeSeconds','pomodoroSeconds','currentPudImageIndex','currentStreak','longestStreak','previousStreak'];
 foreach ($numeric as $key) if (isset($data[$key]) && !is_numeric($data[$key])) reply(400,['error'=>'Invalid '.$key]);
 if (isset($data['settings']) && (!is_array($data['settings']) || array_is_list($data['settings']))) reply(400,['error'=>'Invalid settings']);
 foreach (['unlockedAchievements','missionLogs'] as $key) if (isset($data[$key]) && (!is_array($data[$key]) || !array_is_list($data[$key]))) reply(400,['error'=>'Invalid '.$key]);
 foreach (($data['unlockedAchievements']??[]) as $id) if (!is_string($id) || strlen($id)>128 || $id==='') reply(400,['error'=>'Invalid achievement ID']);
 foreach (($data['missionLogs']??[]) as $log) if (!is_array($log) || !is_string($log['text']??null) || !is_string($log['date']??null) || strlen($log['text'])>10000 || strlen($log['date'])>128) reply(400,['error'=>'Invalid mission log']);
 foreach (($data['settings']??[]) as $key=>$value) if (!is_string($key) || strlen($key)>128 || !(is_scalar($value) || $value===null)) reply(400,['error'=>'Invalid setting']);
 $stmt=$db->prepare("INSERT INTO app_snapshot(id,payload,updated_at) VALUES(1,?,datetime('now')) ON CONFLICT(id) DO UPDATE SET payload=excluded.payload, updated_at=excluded.updated_at");
 $db->beginTransaction();
 try { $stmt->execute([json_encode($data,JSON_UNESCAPED_UNICODE|JSON_THROW_ON_ERROR)]); pud_sync_relational($db,$data); $db->commit(); } catch (Throwable $e) { $db->rollBack(); throw $e; }
 reply(200,['ok'=>true]);
} catch (Throwable $e) { error_log($e->getMessage()); reply(500,['error'=>'Database operation failed']); }
