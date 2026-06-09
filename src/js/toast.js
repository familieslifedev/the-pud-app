import { playUiSound, playErrorSound } from "./uiSounds.js";

export function showToast(message, type = "notification") {
  const container = document.getElementById("toastContainer");

  if (!container) return;

  if (type === "error") {
    playErrorSound();
  } else {
    playUiSound(type);
  }

  const toast = document.createElement("div");

  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(function () {
    toast.classList.add("toast-hide");
  }, 2500);

  setTimeout(function () {
    toast.remove();
  }, 3000);
}
