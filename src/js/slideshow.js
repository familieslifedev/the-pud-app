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
