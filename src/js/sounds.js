const soundLibrary = {
  rainfall: ["rain.mp3", "surface.mp3"],
  thunderstorm: ["loud-rain.mp3", "rain.mp3", "thunder.mp3", "wind.mp3"],
  office: ["air-con.mp3", "copier.mp3", "coworkers.mp3", "flourescent-hum.mp3", "mechanical-keyboard.mp3"],
  forest: ["birds.mp3", "insects.mp3", "wind.mp3"],
  cafe: ["cafe.mp3", "coffee-maker.mp3"],
  beach: ["ocean.mp3", "seagulls.mp3", "wind.mp3"],
  ocean: ["birds.mp3", "boat.mp3", "bubbles.mp3", "splash.mp3", "waves.mp3"],
  campfire: ["crickets.mp3", "fire-crackle.mp3"],
  creek: ["stream.mp3", "wind.mp3"],
  garden: ["chimes.mp3", "insects.mp3", "wind.mp3"],
  train: ["tracks.mp3", "wind.mp3"],
  binaural: ["binaural-music.mp3"],
  noise: ["airplane-cabin.mp3", "brown.mp3", "green.mp3", "pink.mp3", "speech-blocker.mp3", "white.mp3"]
};

let activeSounds = {};
let customSound = null;

function loadSoundEnvironment(environment) {
  if (!settings.soundsEnabled) return;
  stopAllSounds();

  const controls = document.getElementById("soundControls");
  controls.innerHTML = "";

  if (!environment) return;

  soundLibrary[environment].forEach(function (file) {
    const path = `../assets/sounds/${environment}/${file}`;
    const audio = new Audio(path);

    audio.loop = true;
    audio.volume = 0.5;

    activeSounds[file] = audio;

    const row = document.createElement("div");
    row.className = "sound-row";

    row.innerHTML = `
      <span>${file.replace(".mp3", "")}</span>
      <button onclick="toggleSound('${file}')">Play / Pause ⏯️</button>
      <input type="range" min="0" max="100" value="50" oninput="setSoundVolume('${file}', this.value)" />
    `;

    controls.appendChild(row);
  });
}

function toggleSound(file) {
  if (!settings.soundsEnabled) return;
  const audio = activeSounds[file];

  if (!audio) return;

  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
}

function setSoundVolume(file, value) {
  const audio = activeSounds[file];

  if (!audio) return;

  audio.volume = Number(value) / 100;
}

function stopAllSounds() {
  Object.values(activeSounds).forEach(function (audio) {
    audio.pause();
    audio.currentTime = 0;
    audio.volume = 0.5;
  });

  if (customSound) {
    customSound.pause();
    customSound.currentTime = 0;
    customSound.volume = 0.5;
  }

  document
    .querySelectorAll(".sound-row input[type='range']")
    .forEach(function (slider) {
      slider.value = 50;
    });
}

function loadCustomSound(input) {
  const file = input.files[0];

  if (!file) return;

  if (customSound) {
    customSound.pause();
  }

  customSound = new Audio(URL.createObjectURL(file));
  customSound.loop = true;
  customSound.volume = 0.5;
}

function toggleCustomSound() {
  if (!settings.soundsEnabled) return;
  if (!customSound) return;

  if (customSound.paused) {
    customSound.play();
  } else {
    customSound.pause();
  }
}