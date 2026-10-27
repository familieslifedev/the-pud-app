# Pud PHP + SQLite migration

Run from repository root: `php -S localhost:8000 router.php`.
Requires PHP 8.1+ with `pdo_sqlite` and `fileinfo`. Visit http://localhost:8000.

## Import your original Live Server data
Open **Data Backup**, choose your original JSON export and click **Import JSON**. This replaces the SQLite snapshot, so export a backup first if necessary. Do not commit the SQLite database or uploaded photos.

The SQLite file is created automatically in `storage/pud.sqlite`. The frontend uses debounced writes (~1.2 seconds), not one request per timer tick. Original bundled slideshow images are discovered from `assets/images/pud/` automatically, and uploads from `storage/uploads/` appear alongside them.

## Notes
- This is a local single-user development build. Do not expose it to the public internet without authentication and access controls.
- The SQLite snapshot preserves the existing JSON shape for compatibility. Further normalisation into tables can follow once the migration is verified.
- Stop the server before copying database files; SQLite may use WAL journal files.
- Run `php -r 'echo extension_loaded("pdo_sqlite") ? "YES" : "NO";'` to verify SQLite support.
- The app's original JS behaviour and sound effects remain unchanged.
