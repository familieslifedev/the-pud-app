import { state } from "./state.js";
import { checkAchievements } from "./achievements.js";
import { savePudData } from "./storage.js";

export function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return [
    String(hrs).padStart(2, "0"),
    String(mins).padStart(2, "0"),
    String(secs).padStart(2, "0")
  ].join(":");
}

export function formatPomodoro(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function renderTimers() {
  const uptimeDisplay = document.getElementById("uptimeDisplay");
  const pomodoroDisplay = document.getElementById("pomodoroDisplay");

  if (uptimeDisplay) {
    uptimeDisplay.textContent = formatTime(state.uptimeSeconds);
  }

  if (pomodoroDisplay) {
    pomodoroDisplay.textContent = formatPomodoro(state.pomodoroSeconds);
  }
}

export function startUptime() {
  if (state.uptimeInterval !== null) return;

  state.uptimeInterval = setInterval(function () {
    state.uptimeSeconds++;
    renderTimers();
    checkAchievements();
    savePudData();
  }, 1000);
}

export function pauseUptime() {
  clearInterval(state.uptimeInterval);
  state.uptimeInterval = null;
}

export function resetUptime() {
  pauseUptime();
  state.uptimeSeconds = 0;
  renderTimers();
  savePudData();
}

export function startPomodoro() {
  if (state.pomodoroInterval !== null) return;

  state.pomodoroInterval = setInterval(function () {
    if (state.pomodoroSeconds <= 0) {
      pausePomodoro();
      checkAchievements();
      savePudData();
      alert("🍅 Pud Pomodoro complete. Snack acquisition recommended.");
      return;
    }

    state.pomodoroSeconds--;
    renderTimers();
    checkAchievements();
    savePudData();
  }, 1000);
}

export function pausePomodoro() {
  clearInterval(state.pomodoroInterval);
  state.pomodoroInterval = null;
}

export function resetPomodoro() {
  pausePomodoro();
  state.pomodoroSeconds = 25 * 60;
  renderTimers();
  savePudData();
}