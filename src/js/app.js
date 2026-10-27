import { loadPudData, exportPudData, importPudData } from "./storage.js";
import { applySettings, updateSetting } from "./settings.js";
import { finishLoading } from "./loading.js";
import { showToast } from "./toast.js";
import { state } from "./state.js";

import {
  generateQuote,
  setLocation,
  changeMetric,
  updateCaffeine,
  addMissionLog,
  clearMissionLog,
  resetPudData,
} from "./actions.js";

import {
  startUptime,
  pauseUptime,
  resetUptime,
  startPomodoro,
  pausePomodoro,
  resetPomodoro,
} from "./timer.js";

import {
  loadSoundEnvironment,
  toggleCustomSound,
  loadCustomSound,
  setCustomSoundVolume,
  removeCustomSound,
  stopAllSounds,
} from "./sounds.js";

import {
  nextPudImage,
  previousPudImage,
  togglePudSlideshow,
  stopPudSlideshow,
  initPudUploader,
} from "./slideshow.js";

import {
  getWeather,
  searchWeatherLocation,
  loadPreferredWeather,
  clearWeatherDisplay,
  syncWeatherInputs,
} from "./weather.js";

import { updateStreak, renderStreak } from "./streaks.js";
import { renderGreeting } from "./greetings.js";

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
window.loadPreferredWeather = loadPreferredWeather;
window.clearWeatherDisplay = clearWeatherDisplay;
window.syncWeatherInputs = syncWeatherInputs;

window.updateSetting = updateSetting;

async function bootPud() {
  try {
    await loadPudData();
    renderStreak();
    applySettings();
    loadPreferredWeather();
    await initPudUploader();
    finishLoading(function () {
      state.hasLoaded = true;
      updateStreak();
      renderGreeting();
    });
  } catch (error) {
    console.error('Pud startup failed:', error);
    alert('Pud could not load saved data. Check the PHP server and SQLite extension.');
  }
}
bootPud();

document.getElementById('pudExport')?.addEventListener('click', async () => {
 try {
  const data = await exportPudData();
  const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)],{type:'application/json'}));
  const link = document.createElement('a'); link.href=url; link.download='pud-backup.json'; link.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
 } catch(error) { document.getElementById('pudBackupStatus').textContent=error.message; }
});
document.getElementById('pudImport')?.addEventListener('click', async () => {
 const file=document.getElementById('pudImportFile').files[0];
 if (!file) return;
 if (!confirm('Replace Pud saved data with this JSON backup?')) return;
 try { await importPudData(JSON.parse(await file.text())); location.reload(); }
 catch(error) { document.getElementById('pudBackupStatus').textContent=error.message; }
});
