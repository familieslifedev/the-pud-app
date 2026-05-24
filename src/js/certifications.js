function updateCertification() {
    let certification = certifications[0];

    if (unlockedAchievements.length >= 1) {
        certification = certifications[1];
    }

    if (unlockedAchievements.length >= 2) {
        certification = certifications[2];
    }

    if (unlockedAchievements.length >= 3) {
        certification = certifications[3];
    }

    if (unlockedAchievements.length >= 5) {
        certification = certifications[4];
    }

    if (unlockedAchievements.length >= 7) {
        certification = certifications[5];
    }

    document.getElementById("achievement").textContent =
        `👁️ ${certification}`;
}