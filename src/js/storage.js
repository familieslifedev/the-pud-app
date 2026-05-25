import { state } from "./state.js";

import {
  renderStats
} from "./ui.js";

import {
  renderTimers
} from "./timer.js";

import {
  renderAchievements
} from "./achievements.js";

import {
  updateCertification
} from "./certifications.js";

import {
  renderMissionLog,
  setLocation,
  updateCaffeine
} from "./actions.js";

import {
  renderPudImage
} from "./slideshow.js";

import {
  updateApproval
} from "./approval.js";

import {
  settings,
  loadSettings,
  applySettings
} from "./settings.js";

export function savePudData() {
  const pudData = {
    currentLocation: state.currentLocation,

    bugs: state.bugs,
    meetings: state.meetings,
    caffeine: state.caffeine,

    approval: state.approval,

    weatherBonus: state.weatherBonus,

    weatherStatus: getText("weatherStatus"),
    weatherTemp: getText("weatherTemp"),
    weatherLocation: getText("weatherLocation"),

    quote: getText("quote"),
    achievement: getText("achievement"),

    unlockedAchievements:
      state.unlockedAchievements,

    missionLogs: state.missionLogs,

    uptimeSeconds: state.uptimeSeconds,
    pomodoroSeconds: state.pomodoroSeconds,

    currentPudImageIndex:
      state.currentPudImageIndex,

    settings
  };

  localStorage.setItem(
    "pudData",
    JSON.stringify(pudData)
  );
}

export function loadPudData() {
  const savedData =
    localStorage.getItem("pudData");

  if (savedData === null) {
    loadDefaultPudData();

    loadSettings();
    applySettings();

    return;
  }

  const pudData = JSON.parse(savedData);

  state.currentLocation =
    pudData.currentLocation ?? "Home";

  state.bugs = pudData.bugs ?? 0;
  state.meetings = pudData.meetings ?? 0;
  state.caffeine = pudData.caffeine ?? 0;

  state.approval =
    pudData.approval ?? 0;

  state.weatherBonus =
    pudData.weatherBonus ?? 0;

  state.unlockedAchievements =
    pudData.unlockedAchievements ?? [];

  state.missionLogs =
    pudData.missionLogs ?? [];

  state.uptimeSeconds =
    pudData.uptimeSeconds ?? 0;

  state.pomodoroSeconds =
    pudData.pomodoroSeconds ?? 25 * 60;

  state.currentPudImageIndex =
    pudData.currentPudImageIndex ?? 0;

  loadSettings(
    pudData.settings ?? {}
  );

  setLocation(state.currentLocation);

  renderStats();
  renderTimers();

  renderAchievements();
  updateCertification();

  renderMissionLog();
  renderPudImage();

  setText(
    "weatherBonus",
    state.weatherBonus
  );

  setText(
    "weatherStatus",
    pudData.weatherStatus ??
    "Not loaded"
  );

  setText(
    "weatherTemp",
    pudData.weatherTemp ?? "--"
  );

  setText(
    "weatherLocation",
    pudData.weatherLocation ??
    "Unknown"
  );

  setText(
    "quote",
    pudData.quote ??
    "awaiting amphibian insight..."
  );

  setText(
    "achievement",
    pudData.achievement ??
    "👁️ Chief Wooper Officer"
  );

  updateCaffeine(state.caffeine);

  updateApproval();
  applySettings();
}

export function loadDefaultPudData() {
  setLocation(state.currentLocation);

  updateCaffeine(state.caffeine);

  renderStats();
  renderTimers();

  renderAchievements();
  renderMissionLog();

  renderPudImage();

  updateApproval();
}

export function getText(id) {
  const element =
    document.getElementById(id);

  return element
    ? element.textContent
    : "";
}

export function setText(id, value) {
  const element =
    document.getElementById(id);

  if (!element) {
    return;
  }

  element.textContent = value;
}
