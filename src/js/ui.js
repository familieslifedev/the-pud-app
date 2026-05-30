import { state } from "./state.js";
import { randomNumber } from "./utils.js";
import { setText } from "./storage.js";

export function updateIncidentId() {
  const incident = document.getElementById("incident");

  if (!incident) return;

  const number = randomNumber(1000, 9999);

  const cleanLocation = state.currentLocation
    .toUpperCase()
    .replaceAll(" ", "-");

  incident.textContent = `PUD-${number}-${cleanLocation}`;
}

export function renderStats() {
  setText("bugs", state.bugs);
  setText("meetings", state.meetings);
  setText("caffeine", state.caffeine);

  const caffeineSlider = document.getElementById("caffeineSlider");

  if (caffeineSlider) {
    caffeineSlider.value = state.caffeine;
  }
}
