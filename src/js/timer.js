function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return [
    String(hrs).padStart(2, "0"),
    String(mins).padStart(2, "0"),
    String(secs).padStart(2, "0")
  ].join(":");
}

function formatPomodoro(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function renderTimers() {
  document.getElementById("uptimeDisplay").textContent = formatTime(uptimeSeconds);
  document.getElementById("pomodoroDisplay").textContent = formatPomodoro(pomodoroSeconds);
}

function startUptime() {
  if (uptimeInterval !== null) return;

  uptimeInterval = setInterval(function () {
    uptimeSeconds++;
    renderTimers();
    checkAchievements();
    savePudData();
  }, 1000);
}

function pauseUptime() {
  clearInterval(uptimeInterval);
  uptimeInterval = null;
}

function resetUptime() {
  pauseUptime();
  uptimeSeconds = 0;
  renderTimers();
  savePudData();
}

function startPomodoro() {
  if (pomodoroInterval !== null) return;

  pomodoroInterval = setInterval(function () {
    if (pomodoroSeconds <= 0) {
      pausePomodoro();
      alert("🍅 Pud Pomodoro complete. Snack acquisition recommended.");
      return;
    }

    pomodoroSeconds--;
    renderTimers();
    checkAchievements();
    savePudData();
  }, 1000);
}

function pausePomodoro() {
  clearInterval(pomodoroInterval);
  pomodoroInterval = null;
}

function resetPomodoro() {
  pausePomodoro();
  pomodoroSeconds = 25 * 60;
  renderTimers();
  savePudData();
}