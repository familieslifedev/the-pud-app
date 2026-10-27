import { state } from "./state.js";
import { settings } from "./settings.js";
import { savePudData } from "./storage.js";
import { showToast } from "./toast.js";

export const pudImages = [
  "../assets/images/pud/pud-close.jpg",
  "../assets/images/pud/pud-gaming.jpg",
  "../assets/images/pud/pud-home-desk.jpg",
  "../assets/images/pud/pud-in-bag.jpg",
  "../assets/images/pud/pud-in-hotel.jpg",
  "../assets/images/pud/pud-office.jpg",
  "../assets/images/pud/pud-office-2.jpg",
  "../assets/images/pud/pud-on-bed-1.jpg",
  "../assets/images/pud/pud-on-bed-2.jpg",
  "../assets/images/pud/pud-window.jpg",
  "../assets/images/pud/pud-office-3.jpg",
  "../assets/images/pud/pud-car.jpg",
  "../assets/images/pud/pud-chest.jpg",
  "../assets/images/pud/pud-plane.jpg",
  "../assets/images/pud/pud-very-close.jpg",
  "../assets/images/pud/pud-office-4.jpg",
  "../assets/images/pud/pud-close-bed.jpg",
];

export function renderPudImage() {
  const image = document.getElementById("pudSlideshow");

  if (!image) return;

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
  for (const photo of uploaded) {
    const i = pudImages.indexOf(photo.url);
    if (i >= 0) pudImages.splice(i, 1);
  }
  uploaded = data.images || [];
  for (const photo of uploaded) pudImages.push(photo.url);
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
