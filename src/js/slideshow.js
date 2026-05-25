import { state } from "./state.js";
import { settings } from "./settings.js";
import { savePudData } from "./storage.js";

export const pudImages = [
  "../assets/images/pud/pud-close.jpg",
  "../assets/images/pud/pud-gaming.jpg",
  "../assets/images/pud/pud-home-desk.jpg",
  "../assets/images/pud/pud-in-bag.jpg",
  "../assets/images/pud/pud-in-hotel.jpg",
  "../assets/images/pud/pud-office.jpg",
  "../assets/images/pud/pud-on-bed-1.jpg",
  "../assets/images/pud/pud-on-bed-2.jpg",
  "../assets/images/pud/pud-window.jpg"
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
    return;
  }

  state.slideshowInterval = setInterval(nextPudImage, 4000);
}

export function stopPudSlideshow() {
  clearInterval(state.slideshowInterval);
  state.slideshowInterval = null;
}