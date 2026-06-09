import { quotes, locations } from "./data.js";
import { state } from "./state.js";
import { randomNumber } from "./utils.js";
import { renderStats, updateIncidentId } from "./ui.js";
import { updateApproval } from "./approval.js";
import { checkAchievements } from "./achievements.js";
import { savePudData } from "./storage.js";
import { showToast } from "./toast.js";

export function generateQuote() {
  const quote = quotes[randomNumber(0, quotes.length - 1)];

  document.getElementById("quote").textContent = `“${quote}”`;

  updateApproval();
  checkAchievements();
  updateIncidentId();
  savePudData();
}

export function setLocation(place) {
  state.currentLocation = place;
  const data = locations[place];

  document.getElementById("location").textContent = place;
  document.getElementById("protocol").textContent = data.protocol;
  document.getElementById("descriptor").textContent = data.descriptor;
  document.getElementById("morale").value = data.morale;
  document.getElementById("snacks").value = data.snacks;
  document.getElementById("support").value = data.support;
  document.getElementById("sleepiness").value = data.sleepiness;
  document.getElementById("adventure").value = data.adventure;

  updateApproval();
  updateIncidentId();
  savePudData();
}

export function changeMetric(metric, amount) {
  if (metric === "bugs") {
    state.bugs += amount;
    if (state.bugs < 0) state.bugs = 0;
  }

  if (metric === "meetings") {
    state.meetings += amount;
    if (state.meetings < 0) state.meetings = 0;
  }

  renderStats();
  updateApproval();
  checkAchievements();
  savePudData();
}

export function updateCaffeine(value) {
  state.caffeine = Number(value);

  renderStats();
  updateApproval();
  checkAchievements();
  savePudData();
}

export function addMissionLog() {
  const input = document.getElementById("missionInput");
  const text = input.value.trim();

  if (text === "") return;

  const log = {
    text,
    date: new Date().toLocaleString(),
  };

  state.missionLogs.unshift(log);
  input.value = "";

  renderMissionLog();
  savePudData();
  showToast("📝 Mission logged", "notification");
}

export function renderMissionLog() {
  const list = document.getElementById("missionLog");

  if (!list) return;

  list.innerHTML = "";

  state.missionLogs.forEach(function (log) {
    const item = document.createElement("li");
    item.textContent = `${log.date} — ${log.text}`;
    list.appendChild(item);
  });
}

export function clearMissionLog() {
  state.missionLogs = [];
  renderMissionLog();
  savePudData();
  showToast("🗑️ Mission log cleared", "notification");
}

export function resetPudData() {
  const confirmed = confirm(
    "Reset all Pud data? This will remove saved stats, logs, achievements, timers, settings, and weather state.",
  );

  if (!confirmed) {
    return;
  }

  localStorage.removeItem("pudData");

  showToast("🔄 Pud Data Reset", "reset");

  setTimeout(function () {
    location.reload();
  }, 700);
}
