function updateIncidentId() {
  const incident = document.getElementById("incident");
  if (!incident) return;
  const number = randomNumber(1000, 9999);
  const cleanLocation = currentLocation
    .toUpperCase()
    .replaceAll(" ", "-");

  incident.textContent = `PUD-${number}-${cleanLocation}`;
}

function renderStats() {
  setText("bugs", bugs);
  setText("meetings", meetings);
  setText("caffeine", caffeine);

  const caffeineSlider =
    document.getElementById("caffeineSlider");

  if (caffeineSlider) {
    caffeineSlider.value = caffeine;
  }
}