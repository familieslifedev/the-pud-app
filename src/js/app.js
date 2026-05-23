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
  document.getElementById("mood").textContent = data.mood;
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
    document.getElementById("bugs").textContent = bugs;
  }

  if (metric === "meetings") {
    meetings += amount;
    if (meetings < 0) meetings = 0;
    document.getElementById("meetings").textContent = meetings;
  }

  updateApproval();
  savePudData();
}

function updateCaffeine(value) {
  caffeine = Number(value);

  document.getElementById("caffeine").textContent = caffeine;
  document.getElementById("caffeineSlider").value = caffeine;

  updateApproval();
  savePudData();
}

function updateApproval() {
  const locationData = locations[currentLocation];

  let score = 40;

  score += locationData.morale * 0.18;
  score += locationData.snacks * 0.12;
  score += locationData.support * 0.15;
  score += locationData.adventure * 0.08;

  score += Math.min(bugs, 20) * 0.6;
  score += Math.min(meetings, 10) * 0.8;
  score += weatherBonus;

  if (caffeine < 15) {
    score -= 10;
  } else if (caffeine <= 55) {
    score += 5;
  } else if (caffeine <= 80) {
    score -= 3;
  } else {
    score -= 12;
  }

  if (locationData.sleepiness > 60) {
    score -= (locationData.sleepiness - 60) * 0.4;
  }

  score = Math.max(0, Math.min(100, score));

  document.getElementById("approval").textContent = Math.round(score);
}

function updateIncidentId() {
  const number = randomNumber(1000, 9999);
  const cleanLocation = currentLocation.toUpperCase().replaceAll(" ", "-");

  document.getElementById("incident").textContent = `PUD-${number}-${cleanLocation}`;
}

function savePudData() {
  const pudData = {
    currentLocation,
    bugs,
    meetings,
    caffeine,
    weatherBonus,
    achievement: document.getElementById("achievement").textContent,
    quote: document.getElementById("quote").textContent
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
  caffeine = pudData.caffeine ?? 42;
  weatherBonus = pudData.weatherBonus ?? 0;

  setLocation(currentLocation);

  document.getElementById("bugs").textContent = bugs;
  document.getElementById("meetings").textContent = meetings;
  document.getElementById("achievement").textContent = pudData.achievement ?? "Chief Wooper Officer";
  document.getElementById("quote").textContent = pudData.quote ?? "awaiting amphibian insight...";

  updateCaffeine(caffeine);
  updateApproval();
}

loadPudData();