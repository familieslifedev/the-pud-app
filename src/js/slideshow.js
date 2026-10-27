import { state } from "./state.js";
import { settings } from "./settings.js";
import { savePudData } from "./storage.js";
import { showToast } from "./toast.js";

export const pudImages = [];

export function renderPudImage() {
  const image = document.getElementById("pudSlideshow");

  if (!image) return;

  if (!pudImages.length) { image.removeAttribute('src'); return; }
  state.currentPudImageIndex = ((state.currentPudImageIndex % pudImages.length) + pudImages.length) % pudImages.length;
  image.src = pudImages[state.currentPudImageIndex];
}

export function nextPudImage() {
  state.currentPudImageIndex++;

  if (state.currentPudImageIndex >= pudImages.length) {
    state.currentPudImageIndex = 0;
  }

  renderPudImage();
  savePudData();
}

export function previousPudImage() {
  state.currentPudImageIndex--;

  if (state.currentPudImageIndex < 0) {
    state.currentPudImageIndex = pudImages.length - 1;
  }

  renderPudImage();
  savePudData();
}

export function togglePudSlideshow() {
  if (!settings.slideshowEnabled) return;

  if (state.slideshowInterval !== null) {
    clearInterval(state.slideshowInterval);
    state.slideshowInterval = null;
    showToast("🖼️ Pud slideshow stopped", "notification");
    return;
  }

  state.slideshowInterval = setInterval(nextPudImage, 4000);

  showToast("🖼️ Pud slideshow started", "notification");
}

export function stopPudSlideshow() {
  clearInterval(state.slideshowInterval);
  state.slideshowInterval = null;
  showToast("🖼️ Pud slideshow stopped", "notification");
}

// Uploaded photos are managed by PHP and appended to the existing slideshow.
let uploadCsrf = '';
let uploaded = [];
export async function refreshPudUploads() {
  const response = await fetch('/api/images.php', { credentials: 'same-origin' });
  if (!response.ok) throw new Error('Could not load photos');
  const data = await response.json();
  uploadCsrf = data.csrf || uploadCsrf;
  const bundledResponse = await fetch('/api/slideshow.php');
  if (!bundledResponse.ok) throw new Error('Could not load bundled photos');
  const bundled = (await bundledResponse.json()).images || [];
  uploaded = data.images || [];
  pudImages.splice(0, pudImages.length, ...bundled.map(photo => photo.url), ...uploaded.map(photo => photo.url));
  if (state.currentPudImageIndex >= pudImages.length) state.currentPudImageIndex = 0;
  renderPudImage();
  const gallery = document.getElementById('pudUploadedGallery');
  if (!gallery) return;
  gallery.replaceChildren();
  for (const photo of uploaded) {
    const item = document.createElement('div');
    const img = document.createElement('img'); img.src = photo.url; img.alt = 'Uploaded Pud photo'; img.loading = 'lazy';
    const button = document.createElement('button'); button.type = 'button'; button.textContent = 'Remove';
    button.addEventListener('click', async () => {
      if (!confirm('Remove this uploaded photo?')) return;
      try {
        const res = await fetch('/api/images.php', {method:'DELETE',headers:{'Content-Type':'application/json','X-CSRF-Token':uploadCsrf},body:JSON.stringify({id:photo.id})});
        if (!res.ok) throw new Error((await res.json()).error || 'Delete failed');
        await refreshPudUploads();
      } catch (e) { setUploadStatus(e.message); }
    });
    item.append(img,button); gallery.append(item);
  }
}
function setUploadStatus(message) { const el=document.getElementById('pudUploadStatus'); if(el) el.textContent=message; }
export function initPudUploader() {
  const button=document.getElementById('pudUploadButton');
  const input=document.getElementById('pudImageUpload');
  if (!button || !input) return;
  button.addEventListener('click',async()=>{
    if (!input.files.length) { setUploadStatus('Choose at least one photo first.'); return; }
    const data=new FormData(); for(const file of input.files) data.append('images[]',file);
    button.disabled=true; setUploadStatus('Uploading…');
    try {
      const response=await fetch('/api/images.php',{method:'POST',headers:{'X-CSRF-Token':uploadCsrf},body:data});
      const result=await response.json();
      if (!response.ok) throw new Error(result.error || 'Upload failed');
      input.value=''; await refreshPudUploads();
      setUploadStatus(`${result.uploaded.length} photo(s) added.${result.errors.length ? ' '+result.errors.join('; ') : ''}`);
    } catch(e) { setUploadStatus(e.message); } finally { button.disabled=false; }
  });
  refreshPudUploads().catch(e=>setUploadStatus(e.message));
}
