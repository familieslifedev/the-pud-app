# The Pud App — PHP edition (initial migration)

Run from the project root with PHP 8.1+ and the fileinfo extension:

```sh
php -S localhost:8000 router.php
```

Open http://localhost:8000. **Do not open src/index.html directly**; PHP session initialization is required for uploads.

The existing app UI, JS modules, CSS, localStorage data, sounds and photo paths remain unchanged. The PHP endpoints add persistent image uploads to the slideshow. Restore your original media files to `assets/` (they were excluded from the source-only ZIP).

Uploaded images are stored in `storage/uploads` and served through `/api/image.php`; do not expose the storage directory as a static web root. Each image is limited to 8 MB; the effective maximum is also controlled by PHP's `upload_max_filesize` and `post_max_size`. If uploading multiple images, increase `post_max_size` accordingly.

**Security:** this is intended for a trusted local environment. Add user authentication, request throttling, quotas and production server rules before publishing on the internet. Existing user state is still stored in browser localStorage; a full PHP persistence migration is not yet implemented.

## Migrating from Live Server

VS Code Live Server cannot execute PHP. Keep the existing working version on its current branch until the PHP build is verified. Run the command above in VS Code Terminal, and use `http://localhost:8000`, not the Live Server URL.

## Bringing your existing media back

The source-only archive intentionally omitted most images and audio. Copy the contents of your **original** repository's `assets/images/` and `assets/sounds/` into the corresponding folders here, preserving directory names. Do not replace the whole `assets` directory, as that could overwrite updated code-related assets.

For your 41 new photos, use the in-app uploader after starting PHP. They are saved in `storage/uploads/` and are **not** committed to Git. Keep a separate backup of that folder. Do not use `sips` unless you actually want to resize: uploads support JPEG, PNG, WebP and GIF up to 8 MB each.

If a batch fails, upload fewer photos at once or increase `post_max_size` and `upload_max_filesize` in your active `php.ini`, then restart PHP.

## Smoke test

1. Open the PHP URL; check console for missing media or JavaScript errors.
2. Confirm existing slideshow controls, timers, sounds and settings still work.
3. Upload two photos; check both appear in the gallery and slideshow.
4. Refresh; check they remain. Remove one; check it disappears.
5. Restart PHP; check the remaining photo persists.

This is a local migration build. Browser state is still in localStorage, and the upload API has no user authentication. **Do not deploy this build publicly** without further hardening.
