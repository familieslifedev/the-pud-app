function updateIncidentId() {
  const number = randomNumber(1000, 9999);
  const cleanLocation = currentLocation.toUpperCase().replaceAll(" ", "-");

  document.getElementById("incident").textContent = `PUD-${number}-${cleanLocation}`;
}

function renderStats() {
  document.getElementById("bugs").textContent = bugs;
  document.getElementById("meetings").textContent = meetings;
  document.getElementById("caffeine").textContent = caffeine;
  document.getElementById("caffeineSlider").value = caffeine;
}