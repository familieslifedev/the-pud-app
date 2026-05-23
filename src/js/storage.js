function savePudData() {
  const pudData = {
    currentLocation,
    bugs,
    meetings,
    caffeine,
    weatherBonus,
    achievement: document.getElementById("achievement").textContent,
    quote: document.getElementById("quote").textContent,
    missionLogs: missionLogs,
    uptimeSeconds,
    pomodoroSeconds,
  };

  localStorage.setItem("pudData", JSON.stringify(pudData));
}

function loadPudData() {
  const savedData = localStorage.getItem("pudData");

  if (savedData === null) {
    setLocation(currentLocation);
    updateCaffeine(caffeine);
    return;
  }

  const pudData = JSON.parse(savedData);

  currentLocation = pudData.currentLocation ?? "Home";
  bugs = pudData.bugs ?? 0;
  meetings = pudData.meetings ?? 0;
  caffeine = pudData.caffeine ?? 0;
  weatherBonus = pudData.weatherBonus ?? 0;

  setLocation(currentLocation);

  document.getElementById("achievement").textContent =
    pudData.achievement ?? "Chief Wooper Officer";

  document.getElementById("quote").textContent =
    pudData.quote ?? "awaiting amphibian insight...";

    uptimeSeconds = pudData.uptimeSeconds ?? 0;
    pomodoroSeconds = pudData.pomodoroSeconds ?? 25 * 60;

  renderStats();
  updateApproval();
  renderTimers();
}