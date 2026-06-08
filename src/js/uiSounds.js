import { settings } from "./settings.js";

const uiSounds = {
  achievement: "../assets/sounds/ui/achievement.oga",
  error: "../assets/sounds/ui/error.oga",
  pomodoro: "../assets/sounds/ui/pomodoro.oga",
  notification: "../assets/sounds/ui/notification.oga",
};

export function playUiSound(type) {
  if (!settings.soundsEnabled) return;
  if (!uiSounds[type]) return;

  const audio = new Audio(uiSounds[type]);
  audio.volume = 0.5;

  audio.play().catch(function () {
    console.log("UI sound blocked until user interaction.");
  });
}
