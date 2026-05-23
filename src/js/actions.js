function generateQuote() {
  const quote = quotes[randomNumber(0, quotes.length - 1)];
  const achievement = achievements[randomNumber(0, achievements.length - 1)];

  document.getElementById("quote").textContent = `“${quote}”`;
  document.getElementById("achievement").textContent = achievement;

  updateApproval();
  updateIncidentId();
  savePudData();
}

function setLocation(place) {
  currentLocation = place;
  const data = locations[place];

  document.getElementById("location").textContent = place;
  document.getElementById("protocol").textContent = data.protocol;

  document.getElementById("morale").value = data.morale;
  document.getElementById("snacks").value = data.snacks;
  document.getElementById("support").value = data.support;
  document.getElementById("sleepiness").value = data.sleepiness;
  document.getElementById("adventure").value = data.adventure;

  updateApproval();
  updateIncidentId();
  savePudData();
}

function changeMetric(metric, amount) {
  if (metric === "bugs") {
    bugs += amount;
    if (bugs < 0) bugs = 0;
  }

  if (metric === "meetings") {
    meetings += amount;
    if (meetings < 0) meetings = 0;
  }

  renderStats();
  updateApproval();
  checkAchievements();
  savePudData();
}

function updateCaffeine(value) {
  caffeine = Number(value);

  renderStats();
  updateApproval();
  checkAchievements();
  savePudData();
}

function addMissionLog() {
  const input = document.getElementById("missionInput");
  const text = input.value.trim();

  if (text === "") {
    return;
  }

  const log = {
    text: text,
    date: new Date().toLocaleString()
  };

  missionLogs.unshift(log);
  input.value = "";

  renderMissionLog();
  savePudData();
}

function renderMissionLog() {
  const list = document.getElementById("missionLog");
  list.innerHTML = "";

  missionLogs.forEach(function (log) {
    const item = document.createElement("li");
    item.textContent = `${log.date} — ${log.text}`;
    list.appendChild(item);
  });
}

function clearMissionLog() {
  missionLogs = [];
  renderMissionLog();
  savePudData();
}

function resetPudData() {
  localStorage.removeItem("pudData");
  location.reload();
}