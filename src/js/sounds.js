import { state } from "./state.js";
import { settings } from "./settings.js";
import { showToast } from "./toast.js";

export const soundLibrary = {
  rainfall: ["rain.mp3", "surface.mp3"],
  thunderstorm: ["loud-rain.mp3", "rain.mp3", "thunder.mp3", "wind.mp3"],

  office: [
    "air-con.mp3",
    "copier.mp3",
    "coworkers.mp3",
    "flourescent-hum.mp3",
    "mechanical-keyboard.mp3",
  ],

  forest: ["birds.mp3", "insects.mp3", "wind.mp3"],

  cafe: ["cafe.mp3", "coffee-maker.mp3"],

  beach: ["ocean.mp3", "seagulls.mp3", "wind.mp3"],

  ocean: ["birds.mp3", "boat.mp3", "bubbles.mp3", "splash.mp3", "waves.mp3"],

  campfire: ["crickets.mp3", "fire-crackle.mp3"],

  creek: ["stream.mp3", "wind.mp3"],

  garden: ["chimes.mp3", "insects.mp3", "wind.mp3"],

  train: ["tracks.mp3", "wind.mp3"],

  binaural: ["binaural-music.mp3"],

  noise: [
    "airplane-cabin.mp3",
    "brown.mp3",
    "green.mp3",
    "pink.mp3",
    "speech-blocker.mp3",
    "white.mp3",
  ],
};

export function loadSoundEnvironment(environment) {
  if (!settings.soundsEnabled) return;

  state.currentSoundEnvironment = environment;

  stopAllSounds();

  const controls = document.getElementById("soundControls");

  if (!controls) return;

  controls.innerHTML = "";

  if (!environment) return;

  soundLibrary[environment].forEach(function (file) {
    const path = `../assets/sounds/${environment}/${file}`;

    const audio = new Audio(path);

    audio.loop = true;
    audio.volume = 0.5;

    state.activeSounds[file] = audio;

    const row = document.createElement("div");

    row.className = "sound-row";

    row.innerHTML = `
      <span>${file.replace(".mp3", "")}</span>

      <button data-file="${file}" class="sound-toggle">
        Play / Pause ⏯️
      </button>

      <input
        type="range"
        min="0"
        max="100"
        value="50"
        data-file="${file}"
        class="sound-volume"
      />
    `;

    controls.appendChild(row);
  });

  attachSoundEventListeners();

  if (environment) {
    showToast(`🎧 ${environment} environment loaded`, "notification");
  }
}

function attachSoundEventListeners() {
  document.querySelectorAll(".sound-toggle").forEach(function (button) {
    button.addEventListener("click", function () {
      toggleSound(button.dataset.file);
    });
  });

  document.querySelectorAll(".sound-volume").forEach(function (slider) {
    slider.addEventListener("input", function () {
      setSoundVolume(slider.dataset.file, slider.value);
    });
  });
}

export function toggleSound(file) {
  if (!settings.soundsEnabled) return;

  const audio = state.activeSounds[file];

  if (!audio) return;

  if (audio.paused) {
    audio.play().catch(function () {
      console.log("Audio playback blocked until interaction.");
    });
  } else {
    audio.pause();
  }
}

export function setSoundVolume(file, value) {
  const audio = state.activeSounds[file];

  if (!audio) return;

  audio.volume = Number(value) / 100;
}

export function stopAllSounds() {
  Object.values(state.activeSounds).forEach(function (audio) {
    audio.pause();
    audio.currentTime = 0;
    audio.volume = 0.5;
  });

  if (state.customSound) {
    state.customSound.pause();
    state.customSound.currentTime = 0;
    state.customSound.volume = 0.5;
  }

  const customSlider = document.getElementById("customSoundVolume");

  if (customSlider) {
    customSlider.value = 50;
  }

  document
    .querySelectorAll(".sound-row input[type='range']")
    .forEach(function (slider) {
      slider.value = 50;
    });
}

export function loadCustomSound(input) {
  const file = input.files[0];

  if (!file) return;

  if (state.customSound) {
    state.customSound.pause();
  }

  state.customSound = new Audio(URL.createObjectURL(file));

  state.customSound.loop = true;
  state.customSound.volume = 0.5;
}

export function toggleCustomSound() {
  if (!settings.soundsEnabled) return;

  if (!state.customSound) return;

  if (state.customSound.paused) {
    state.customSound.play();
  } else {
    state.customSound.pause();
  }
  showToast("🎵 Custom audio loaded", "notification");
}

export function setCustomSoundVolume(value) {
  if (!state.customSound) return;

  state.customSound.volume = Number(value) / 100;
}

export function removeCustomSound() {
  if (!state.customSound) return;

  state.customSound.pause();

  URL.revokeObjectURL(state.customSound.src);

  state.customSound = null;

  const input = document.getElementById("customSoundInput");

  if (input) {
    input.value = "";
  }
  showToast("🗑️ Custom audio removed", "notification");
}
