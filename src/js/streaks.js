import { state } from "./state.js";
import { savePudData } from "./storage.js";
import { showToast } from "./toast.js";
import { checkAchievements } from "./achievements.js";

export function updateStreak() {
  const today = getDateString(new Date());

  if (!state.lastActiveDate) {
    state.currentStreak = 1;
    state.longestStreak = 1;
    state.previousStreak = 0;
    state.lastActiveDate = today;

    renderStreak();
    checkAchievements();
    savePudData();
    return;
  }

  const difference = getDayDifference(state.lastActiveDate, today);

  if (difference === 0) {
    renderStreak();
    return;
  }

  if (difference === 1) {
    state.currentStreak++;

    if (state.currentStreak > state.longestStreak) {
      state.longestStreak = state.currentStreak;
    }

    showToast(
      `🔥 Streak Increased: ${state.currentStreak} Days`,
      "notification",
    );
  }

  if (difference > 1) {
    if (state.currentStreak > 1) {
      state.previousStreak = state.currentStreak;

      showToast(
        `💔 Streak Reset: Previous streak was ${state.previousStreak} days`,
        "notification",
      );
    }

    state.currentStreak = 1;
  }

  state.lastActiveDate = today;

  renderStreak();
  checkAchievements();
  savePudData();
}

export function renderStreak() {
  const current = document.getElementById("currentStreak");
  const longest = document.getElementById("longestStreak");
  const previous = document.getElementById("previousStreak");
  const previousRow = document.getElementById("previousStreakRow");

  if (current) {
    current.textContent = state.currentStreak;
  }

  if (longest) {
    longest.textContent = state.longestStreak;
  }

  if (previous) {
    previous.textContent = state.previousStreak;
  }

  if (previousRow) {
    previousRow.classList.toggle("hidden", state.previousStreak <= 0);
  }
}

function getDateString(date) {
  return date.toISOString().split("T")[0];
}

function getDayDifference(previousDate, currentDate) {
  const previous = new Date(previousDate);
  const current = new Date(currentDate);

  return Math.floor((current - previous) / (1000 * 60 * 60 * 24));
}
