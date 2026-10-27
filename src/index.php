<?php
session_start();
if (empty($_SESSION['pud_csrf'])) $_SESSION['pud_csrf'] = bin2hex(random_bytes(32));
header('Content-Type: text/html; charset=utf-8');
readfile(__DIR__ . '/index.html');
