import { state } from "./state.js";

import { renderStats } from "./ui.js";

import { renderTimers } from "./timer.js";

import { renderAchievements } from "./achievements.js";

import { updateCertification } from "./certifications.js";

import { renderMissionLog, setLocation, updateCaffeine } from "./actions.js";

import { renderPudImage } from "./slideshow.js";

import { updateApproval } from "./approval.js";

import { settings, loadSettings, applySettings } from "./settings.js";

let hydrated = false;
let pendingSave = null;
let csrf = '';
let saveSequence = Promise.resolve();

export function savePudData() {
  if (!hydrated) return;

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

    unlockedAchievements: state.unlockedAchievements,

    missionLogs: state.missionLogs,

    uptimeSeconds: state.uptimeSeconds,
    pomodoroSeconds: state.pomodoroSeconds,

    currentPudImageIndex: state.currentPudImageIndex,

    settings,

    currentStreak: state.currentStreak,
    longestStreak: state.longestStreak,
    previousStreak: state.previousStreak,
    lastActiveDate: state.lastActiveDate,
  };

  clearTimeout(pendingSave);
  pendingSave = setTimeout(() => {
    const snapshot = JSON.stringify(pudData);
    saveSequence = saveSequence.catch(() => {}).then(async () => {
      const response = await fetch('/api/state.php', {method:'PUT',headers:{'Content-Type':'application/json','X-CSRF-Token':csrf},body:snapshot});
      if (!response.ok) throw new Error('Pud state could not be saved');
    });
    saveSequence.catch(error => console.error(error));
  }, 1200);
}

export async function loadPudData() {
  const response = await fetch('/api/state.php');
  if (!response.ok) throw new Error('Cannot load Pud database');
  const result = await response.json();
  csrf = result.csrf;
  const savedData = result.data;


  if (savedData === null) {
    loadDefaultPudData();

    loadSettings();
    applySettings();

    hydrated = true;
    return;
  }

  const pudData = savedData;

  state.currentLocation = pudData.currentLocation ?? "Home";

  state.bugs = pudData.bugs ?? 0;
  state.meetings = pudData.meetings ?? 0;
  state.caffeine = pudData.caffeine ?? 0;

  state.approval = pudData.approval ?? 0;

  state.weatherBonus = pudData.weatherBonus ?? 0;

  state.unlockedAchievements = pudData.unlockedAchievements ?? [];

  state.missionLogs = pudData.missionLogs ?? [];

  state.uptimeSeconds = pudData.uptimeSeconds ?? 0;

  state.pomodoroSeconds = pudData.pomodoroSeconds ?? 25 * 60;

  state.currentPudImageIndex = pudData.currentPudImageIndex ?? 0;

  loadSettings(pudData.settings ?? {});

  setLocation(state.currentLocation);

  renderStats();
  renderTimers();

  renderAchievements();
  updateCertification();

  renderMissionLog();
  renderPudImage();

  setText("weatherBonus", state.weatherBonus);

  setText("weatherStatus", pudData.weatherStatus ?? "Not loaded");

  setText("weatherTemp", pudData.weatherTemp ?? "--");

  setText("weatherLocation", pudData.weatherLocation ?? "Unknown");

  setText("quote", pudData.quote ?? "awaiting amphibian insight...");

  setText("achievement", pudData.achievement ?? "👁️ Chief Wooper Officer");

  updateCaffeine(state.caffeine);

  updateApproval();
  applySettings();

  state.currentStreak = pudData.currentStreak ?? 0;
  state.longestStreak = pudData.longestStreak ?? 0;
  state.previousStreak = pudData.previousStreak ?? 0;
  state.lastActiveDate = pudData.lastActiveDate ?? null;
  hydrated = true;
}

export async function resetStoredPudData() {
  clearTimeout(pendingSave);
  hydrated = false;
  await saveSequence.catch(() => {});
  const response = await fetch('/api/state.php', {method:'DELETE',headers:{'X-CSRF-Token':csrf}});
  if (!response.ok) throw new Error('Reset failed');
}

export async function importPudData(data) {
  const response = await fetch('/api/state.php', {method:'PUT',headers:{'Content-Type':'application/json','X-CSRF-Token':csrf},body:JSON.stringify(data)});
  if (!response.ok) throw new Error('Import failed');
}

export async function exportPudData() {
  const response = await fetch('/api/state.php');
  if (!response.ok) throw new Error('Export failed');
  return (await response.json()).data;
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
  const element = document.getElementById(id);

  return element ? element.textContent : "";
}

export function setText(id, value) {
  const element = document.getElementById(id);

  if (!element) {
    return;
  }

  element.textContent = value;
}
