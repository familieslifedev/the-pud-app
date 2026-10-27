<?php
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
if ($path === '/') { header('Location: /src/index.php'); exit; }
if (str_starts_with($path, '/storage/') || str_starts_with($path, '/.')) { http_response_code(404); exit; }
$file = realpath(__DIR__ . $path);
if ($file && str_starts_with($file, __DIR__ . DIRECTORY_SEPARATOR) && is_file($file)) {
    if (str_ends_with($file, '.php')) { require $file; return true; }
    return false;
}
http_response_code(404); echo 'Not found';
