import { state } from "./state.js";
import {
    stopAllSounds,
    loadSoundEnvironment
} from "./sounds.js";

import { stopPudSlideshow } from "./slideshow.js";
import { savePudData } from "./storage.js";

export let settings = {
    soundsEnabled: true,
    slideshowEnabled: true,
    weatherEnabled: true,
    preferredEnvironment: "",
    preferredLocation: ""
};

export function updateSetting(key, value) {
    settings[key] = value;

    applySettings();
    savePudData();
}

export function loadSettings(savedSettings = {}) {
    settings = {
        ...settings,
        ...savedSettings
    };

    document.getElementById("soundsEnabled").checked =
        settings.soundsEnabled;

    document.getElementById("slideshowEnabled").checked =
        settings.slideshowEnabled;

    document.getElementById("weatherEnabled").checked =
        settings.weatherEnabled;

    document.getElementById("preferredEnvironment").value =
        settings.preferredEnvironment;

    document.getElementById("preferredLocation").value =
        settings.preferredLocation;

    applySettings();
}

export function applySettings() {
    applyAudioSettings();
    applySlideshowSettings();
    applyWeatherSettings();
}

function applyAudioSettings() {
    const audioCard =
        document.getElementById("audioCard");

    const selector =
        document.getElementById("soundEnvironment");

    const soundControls =
        document.getElementById("soundControls");

    const stopAudioButton =
        document.getElementById("stopAudioButton");

    const message =
        document.getElementById("audioDisabledMessage");

    if (
        !audioCard ||
        !selector ||
        !soundControls ||
        !message
    ) {
        return;
    }

    if (!settings.soundsEnabled) {
        stopAllSounds();

        audioCard.classList.add("disabled-section");

        selector.innerHTML = `
      <option value="">Audio is disabled in settings</option>
    `;

        selector.value = "";
        selector.disabled = true;

        soundControls.innerHTML = "";

        message.classList.remove("hidden");

        if (customAudioSection) {
            customAudioSection.classList.add("hidden");
        }

        if (stopAudioButton) {
            stopAudioButton.disabled = true;
        }

        return;
    }

    audioCard.classList.remove("disabled-section");

    selector.disabled = false;
    selector.innerHTML = getSoundEnvironmentOptions();

    selector.value =
        settings.preferredEnvironment ?? "";

    message.classList.add("hidden");

    if (customAudioSection) {
        customAudioSection.classList.remove("hidden");
    }

    if (stopAudioButton) {
        stopAudioButton.disabled = false;
    }

    if (
        settings.preferredEnvironment &&
        state.currentSoundEnvironment !==
        settings.preferredEnvironment
    ) {
        loadSoundEnvironment(
            settings.preferredEnvironment
        );
    }
}

function applySlideshowSettings() {
    const slideshowCard =
        document.getElementById("slideshowCard");

    const slideshowContent =
        document.getElementById("slideshowContent");

    const message =
        document.getElementById("slideshowDisabledMessage");

    if (
        !slideshowCard ||
        !slideshowContent ||
        !message
    ) {
        return;
    }

    if (!settings.slideshowEnabled) {
        stopPudSlideshow();

        slideshowCard.classList.add("disabled-section");

        slideshowContent.classList.add("hidden");

        message.classList.remove("hidden");

        return;
    }

    slideshowCard.classList.remove("disabled-section");

    slideshowContent.classList.remove("hidden");

    message.classList.add("hidden");
}

function applyWeatherSettings() {
    const weatherCard =
        document.getElementById("weatherCard");

    if (!weatherCard) return;

    weatherCard.classList.toggle(
        "disabled-section",
        !settings.weatherEnabled
    );
}

function getSoundEnvironmentOptions() {
    return `
    <option value="">Select ambience...</option>
    <option value="rainfall">Rainfall ☔️</option>
    <option value="thunderstorm">Thunderstorm ⛈️</option>
    <option value="office">Office 🏢</option>
    <option value="forest">Forest 🌳</option>
    <option value="cafe">Cafe ☕️</option>
    <option value="beach">Beach 🏖️</option>
    <option value="ocean">Ocean 🌊</option>
    <option value="campfire">Campfire 🔥</option>
    <option value="creek">Creek 🏞️</option>
    <option value="garden">Garden 🌱</option>
    <option value="train">Train 🚆</option>
    <option value="noise">Noise 🎵</option>
    <option value="binaural">Binaural 🎧</option>
  `;
}

const customInput =
    document.getElementById("customSoundInput");

if (customInput) {
    customInput.value = "";
}