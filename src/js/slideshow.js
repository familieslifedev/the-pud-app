const pudImages = [
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

let currentPudImageIndex = 0;
let slideshowInterval = null;

function renderPudImage() {
  const image = document.getElementById("pudSlideshow");

  if (!image) return;

  image.src = pudImages[currentPudImageIndex];
}

function nextPudImage() {
  currentPudImageIndex++;

  if (currentPudImageIndex >= pudImages.length) {
    currentPudImageIndex = 0;
  }

  renderPudImage();
  savePudData();
}

function previousPudImage() {
  currentPudImageIndex--;

  if (currentPudImageIndex < 0) {
    currentPudImageIndex = pudImages.length - 1;
  }

  renderPudImage();
  savePudData();
}

function togglePudSlideshow() {
  if (!settings.slideshowEnabled) return;
  if (slideshowInterval !== null) {
    clearInterval(slideshowInterval);
    slideshowInterval = null;
    return;
  }

  slideshowInterval = setInterval(nextPudImage, 4000);
}

function stopPudSlideshow() {
  clearInterval(slideshowInterval);
  slideshowInterval = null;
}