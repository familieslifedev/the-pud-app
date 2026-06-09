import { certifications } from "./data.js";
import { state } from "./state.js";
import { showToast } from "./toast.js";

export function updateCertification() {
  let certification = certifications[0];

  if (state.unlockedAchievements.length >= 1) {
    certification = certifications[1];
  }

  if (state.unlockedAchievements.length >= 2) {
    certification = certifications[2];
  }

  if (state.unlockedAchievements.length >= 3) {
    certification = certifications[3];
  }

  if (state.unlockedAchievements.length >= 5) {
    certification = certifications[4];
  }

  if (state.unlockedAchievements.length >= 7) {
    certification = certifications[5];
  }

  const achievementElement = document.getElementById("achievement");
  const newText = `👁️ ${certification}`;

  if (achievementElement && achievementElement.textContent !== newText) {
    achievementElement.textContent = newText;

    if (state.hasLoaded) {
      showToast(`🎖️ Certification Promoted: ${certification}`, "achievement");
    }
  }
}
