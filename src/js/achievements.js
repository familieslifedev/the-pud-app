const achievementRules = [
  {
    id: "first_bug",
    name: "🐛 Bug Bonker",
    condition: function () {
      return bugs >= 1;
    }
  },
  {
    id: "bug_intimidator",
    name: "🐛 Senior Bug Intimidator",
    condition: function () {
      return bugs >= 25;
    }
  },
  {
    id: "meeting_survivor",
    name: "💼 Meeting Survivor",
    condition: function () {
      return meetings >= 1;
    }
  },
  {
    id: "corporate_survivor",
    name: "💼 Corporate Amphibian",
    condition: function () {
      return meetings >= 10;
    }
  },
  {
    id: "caffeine_hazard",
    name: "☕ Caffeine Hazard",
    condition: function () {
      return caffeine >= 90;
    }
  },
  {
    id: "one_hour_operator",
    name: "⏱️ One Hour Operator",
    condition: function () {
      return uptimeSeconds >= 3600;
    }
  },

  {
    id: "moisture_maxxer",
    name: "🏅 Moisture Maxxer",
    condition: function () {
      return approval === 100;
    }
  }
];

function checkAchievements() {
  achievementRules.forEach(function (achievement) {
    if (achievement.condition() && !unlockedAchievements.includes(achievement.id)) {
      unlockedAchievements.push(achievement.id);
    }
  });

  renderAchievements();
  updateCertification();
}

function renderAchievements() {
  const list = document.getElementById("achievementList");
  if (!list) return;
  list.innerHTML = "";

  achievementRules.forEach(function (achievement) {
    const item = document.createElement("li");
    const unlocked = unlockedAchievements.includes(achievement.id);

    item.textContent = unlocked ? achievement.name : "🔒 Locked";
    item.className = unlocked ? "achievement unlocked" : "achievement locked";

    list.appendChild(item);
  });
}