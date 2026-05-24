function savePudData() {
  const pudData = {
    currentLocation,
    bugs,
    meetings,
    caffeine,
    approval,

    weatherBonus,
    weatherStatus: getText("weatherStatus"),
    weatherTemp: getText("weatherTemp"),
    weatherLocation: getText("weatherLocation"),

    quote: getText("quote"),
    achievement: getText("achievement"),
    unlockedAchievements,

    missionLogs,

    uptimeSeconds,
    pomodoroSeconds,

    currentPudImageIndex,

    settings
  };

  localStorage.setItem("pudData", JSON.stringify(pudData));
}

function loadPudData() {
  const savedData = localStorage.getItem("pudData");

  if (savedData === null) {
    loadDefaultPudData();
    loadSettings();
    applySettings();
    return;
  }

  const pudData = JSON.parse(savedData);

  currentLocation = pudData.currentLocation ?? "Home";
  bugs = pudData.bugs ?? 0;
  meetings = pudData.meetings ?? 0;
  caffeine = pudData.caffeine ?? 0;
  approval = pudData.approval ?? 0;

  weatherBonus = pudData.weatherBonus ?? 0;

  unlockedAchievements = pudData.unlockedAchievements ?? [];
  missionLogs = pudData.missionLogs ?? [];

  uptimeSeconds = pudData.uptimeSeconds ?? 0;
  pomodoroSeconds = pudData.pomodoroSeconds ?? 25 * 60;

  currentPudImageIndex = pudData.currentPudImageIndex ?? 0;

  loadSettings(pudData.settings ?? {});

  setLocation(currentLocation);
  renderStats();
  renderTimers();
  renderAchievements();
  renderMissionLog();
  renderPudImage();

  setText("weatherBonus", weatherBonus);
  setText("weatherStatus", pudData.weatherStatus ?? "Not loaded");
  setText("weatherTemp", pudData.weatherTemp ?? "--");
  setText("weatherLocation", pudData.weatherLocation ?? "Unknown");

  setText("quote", pudData.quote ?? "awaiting amphibian insight...");
  setText("achievement", pudData.achievement ?? "👁️ Chief Wooper Officer");

  updateCaffeine(caffeine);
  updateApproval();
  applySettings();
}

function loadDefaultPudData() {
  setLocation(currentLocation);
  updateCaffeine(caffeine);
  renderStats();
  renderTimers();
  renderAchievements();
  renderMissionLog();
  renderPudImage();
  updateApproval();
}

function getText(id) {
  const element = document.getElementById(id);
  return element ? element.textContent : "";
}

function setText(id, value) {
  const element = document.getElementById(id);

  if (!element) {
    return;
  }
  element.textContent = value;
}
