import { state } from "./state.js";
import { updateCertification } from "./certifications.js";
import { showToast } from "./toast.js";

export const achievementRules = [
  {
    id: "first_bug",
    name: "🐛 Bug Bonker",
    condition: function () {
      return state.bugs >= 1;
    },
  },
  {
    id: "bug_intimidator",
    name: "🐛 Senior Bug Intimidator",
    condition: function () {
      return state.bugs >= 25;
    },
  },
  {
    id: "meeting_survivor",
    name: "💼 Meeting Survivor",
    condition: function () {
      return state.meetings >= 1;
    },
  },
  {
    id: "corporate_survivor",
    name: "💼 Corporate Amphibian",
    condition: function () {
      return state.meetings >= 10;
    },
  },
  {
    id: "caffeine_hazard",
    name: "☕ Caffeine Hazard",
    condition: function () {
      return state.caffeine >= 90;
    },
  },
  {
    id: "one_hour_operator",
    name: "⏱️ One Hour Operator",
    condition: function () {
      return state.uptimeSeconds >= 3600;
    },
  },
  {
    id: "moisture_maxxer",
    name: "🏅 Moisture Maxxer",
    condition: function () {
      return state.approval === 100;
    },
  },
  {
    id: "three_day_puddle",
    name: "🔥 3 Day Puddle",
    condition: function () {
      return state.currentStreak >= 3;
    },
  },
  {
    id: "seven_day_operator",
    name: "🔥 7 Day Operator",
    condition: function () {
      return state.currentStreak >= 7;
    },
  },
  {
    id: "thirty_day_amphibian",
    name: "🔥 30 Day Amphibian",
    condition: function () {
      return state.currentStreak >= 30;
    },
  },
];

export function checkAchievements() {
  achievementRules.forEach(function (achievement) {
    const alreadyUnlocked = state.unlockedAchievements.includes(achievement.id);

    if (achievement.condition() && !alreadyUnlocked) {
      state.unlockedAchievements.push(achievement.id);

      if (state.hasLoaded) {
        showToast(
          `🏅 Achievement Unlocked: ${achievement.name}`,
          "achievement",
        );
      }
    }
  });

  renderAchievements();
  updateCertification();
}

export function renderAchievements() {
  const list = document.getElementById("achievementList");

  if (!list) return;

  list.innerHTML = "";

  achievementRules.forEach(function (achievement) {
    const item = document.createElement("li");

    const unlocked = state.unlockedAchievements.includes(achievement.id);

    item.textContent = unlocked ? achievement.name : "🔒 Locked";

    item.className = unlocked ? "achievement unlocked" : "achievement locked";

    list.appendChild(item);
  });
}
