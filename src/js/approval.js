function updateApproval() {
  const locationData = locations[currentLocation];

  let score = 0;

  score += locationData.morale * 0.18;
  score += locationData.snacks * 0.12;
  score += locationData.support * 0.15;
  score += locationData.adventure * 0.08;

  score += Math.min(bugs, 20) * 0.6;
  score += Math.min(meetings, 10) * 0.8;
  score += weatherBonus;

  if (caffeine < 15) score -= 10;
  else if (caffeine <= 55) score += 5;
  else if (caffeine <= 80) score -= 3;
  else score -= 12;

  if (locationData.sleepiness > 60) {
    score -= (locationData.sleepiness - 60) * 0.4;
  }

  score = Math.max(0, Math.min(100, score));

  document.getElementById("approval").textContent = Math.round(score);
}