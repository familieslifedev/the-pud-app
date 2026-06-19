export const state = {
  hasLoaded: false,

  currentLocation: "Home",

  bugs: 0,
  meetings: 0,
  caffeine: 0,

  weatherBonus: 0,
  approval: 0,

  missionLogs: [],

  uptimeSeconds: 0,
  uptimeInterval: null,

  pomodoroSeconds: 25 * 60,
  pomodoroInterval: null,

  unlockedAchievements: [],

  currentSoundEnvironment: "",

  currentPudImageIndex: 0,
  slideshowInterval: null,

  activeSounds: {},
  customSound: null,

  currentStreak: 0,
  longestStreak: 0,
  previousStreak: 0,
  lastActiveDate: null,
};
