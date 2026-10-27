<?php
declare(strict_types=1);
function pud_db(): PDO {
 static $db = null;
 if ($db) return $db;
 $folder = dirname(__DIR__) . '/storage';
 if (!is_dir($folder)) mkdir($folder, 0700, true);
 $db = new PDO('sqlite:' . $folder . '/pud.sqlite');
 $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
 $db->exec('PRAGMA busy_timeout=5000; PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL;');
 $db->exec('CREATE TABLE IF NOT EXISTS app_snapshot (id INTEGER PRIMARY KEY CHECK(id=1), payload TEXT NOT NULL, updated_at TEXT NOT NULL)');
 return $db;
}
