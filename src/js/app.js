import { loadPudData } from "./storage.js";
import { applySettings, updateSetting } from "./settings.js";
import { finishLoading } from "./loading.js";

import {
    generateQuote,
    setLocation,
    changeMetric,
    updateCaffeine,
    addMissionLog,
    clearMissionLog,
    resetPudData
} from "./actions.js";

import {
    startUptime,
    pauseUptime,
    resetUptime,
    startPomodoro,
    pausePomodoro,
    resetPomodoro
} from "./timer.js";

import {
    loadSoundEnvironment,
    toggleCustomSound,
    loadCustomSound,
    setCustomSoundVolume,
    removeCustomSound,
    stopAllSounds
} from "./sounds.js";

import {
    nextPudImage,
    previousPudImage,
    togglePudSlideshow,
    stopPudSlideshow
} from "./slideshow.js";

import {
    getWeather,
    searchWeatherLocation
} from "./weather.js";

window.generateQuote = generateQuote;
window.setLocation = setLocation;
window.changeMetric = changeMetric;
window.updateCaffeine = updateCaffeine;
window.addMissionLog = addMissionLog;
window.clearMissionLog = clearMissionLog;
window.resetPudData = resetPudData;

window.startUptime = startUptime;
window.pauseUptime = pauseUptime;
window.resetUptime = resetUptime;
window.startPomodoro = startPomodoro;
window.pausePomodoro = pausePomodoro;
window.resetPomodoro = resetPomodoro;

window.loadSoundEnvironment = loadSoundEnvironment;
window.toggleCustomSound = toggleCustomSound;
window.loadCustomSound = loadCustomSound;
window.setCustomSoundVolume = setCustomSoundVolume;
window.removeCustomSound = removeCustomSound;
window.stopAllSounds = stopAllSounds;

window.nextPudImage = nextPudImage;
window.previousPudImage = previousPudImage;
window.togglePudSlideshow = togglePudSlideshow;
window.stopPudSlideshow = stopPudSlideshow;

window.getWeather = getWeather;
window.searchWeatherLocation = searchWeatherLocation;

window.updateSetting = updateSetting;

loadPudData();
applySettings();
finishLoading();