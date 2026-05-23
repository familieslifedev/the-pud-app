function updateApproval() {
  const locationData = locations[currentLocation];

  let score = 0;

  score += locationData.morale * 0.22;
  score += locationData.snacks * 0.16;
  score += locationData.support * 0.20;
  score += locationData.adventure * 0.10;

  score += Math.min(bugs, 25) * 0.9;
  score += Math.min(meetings, 15) * 0.7;

  score += weatherBonus;

  // caffeine logic
  if (caffeine < 15) {
    score -= 4;
  } else if (caffeine <= 70) {
    score += 8;
  } else if (caffeine <= 90) {
    score += 2;
  } else {
    score -= 6;
  }

  // sleepy penalty
  if (locationData.sleepiness > 70) {
    score -= (locationData.sleepiness - 70) * 0.3;
  }

  // small ambient positivity bonus
  score += 10;

  score = Math.round(Math.max(0, Math.min(100, score)));
  approval = score;
  document.getElementById("approval").textContent = score;

  updateApprovalMood(score);
}

function updateApprovalMood(score) {
  let mood = "neutral dampness";

  if (score >= 90) {
    mood = "ecstatic amphibian";
  } else if (score >= 75) {
    mood = "thriving";
  } else if (score >= 60) {
    mood = "supportive";
  } else if (score >= 45) {
    mood = "slightly concerned";
  } else if (score >= 25) {
    mood = "distressed";
  } else {
    mood = "critical puddle instability";
  }
  document.getElementById("mood").textContent = mood;
}