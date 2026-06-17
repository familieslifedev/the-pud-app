import { state } from "./state.js";
import { savePudData } from "./storage.js";
import { showToast } from "./toast.js";
import { checkAchievements } from "./achievements.js";

export function updateStreak() {
  const today = new Date().toISOString().split("T")[0];

  if (!state.lastActiveDate) {
    state.currentStreak = 1;
    state.longestStreak = 1;
    state.lastActiveDate = today;

    savePudData();
    return;
  }

  const lastDate = new Date(state.lastActiveDate);
  const currentDate = new Date(today);

  const difference = Math.floor(
    (currentDate - lastDate) / (1000 * 60 * 60 * 24),
  );

  if (difference === 0) {
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
  } else {
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

  if (current) {
    current.textContent = state.currentStreak;
  }

  if (longest) {
    longest.textContent = state.longestStreak;
  }
}
