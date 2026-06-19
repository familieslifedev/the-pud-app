import { state } from "./state.js";

export function getStreakMessage() {
  if (state.currentStreak >= 365) {
    return "👁️‿👁️ annual moisture continuity confirmed.";
  }

  if (state.currentStreak >= 100) {
    return "👁️‿👁️ long-term amphibian operations remain stable.";
  }

  if (state.currentStreak >= 30) {
    return "👁️‿👁️ monthly puddle discipline achieved.";
  }

  if (state.currentStreak >= 14) {
    return "👁️‿👁️ fortnightly dampness maintained.";
  }

  if (state.currentStreak >= 7) {
    return "👁️‿👁️ weekly operational consistency detected.";
  }

  if (state.currentStreak >= 3) {
    return "👁️‿👁️ streak formation in progress.";
  }

  return "👁️‿👁️ operational continuity awaiting development.";
}
