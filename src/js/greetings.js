import { state } from "./state.js";
import { locations } from "./data.js";
import { getStreakMessage } from "./streakMessages.js";
import { timeGreetingGroups, conditionalGreetings } from "./greetingData.js";
import { randomNumber } from "./utils.js";

export function renderGreeting() {
  const greeting = document.getElementById("dynamicGreeting");

  if (!greeting) return;

  greeting.textContent = generateGreeting();
}

export function generateGreeting() {
  const parts = [
    getTimeGreeting(),
    getTimeFlavourGreeting(),
    getLocationGreeting(),
    getStreakMessage().replace("👁️‿👁️ ", ""),
    getWeatherGreeting(),
    getBonusGreeting(),
  ];

  return parts.filter(Boolean).join("\n");
}

function getTimeGreeting() {
  const group = getCurrentTimeGreetingGroup();

  return group ? group.core : "";
}

function getTimeFlavourGreeting() {
  const group = getCurrentTimeGreetingGroup();

  if (!group || !group.messages.length) return "";

  return getRandomMessage(group.messages);
}

function getLocationGreeting() {
  const location = locations[state.currentLocation];

  if (!location) return "";

  return `current environment: ${state.currentLocation.toLowerCase()} — ${location.descriptor}.`;
}

function getWeatherGreeting() {
  if (state.weatherBonus > 0) {
    return "weather impact: favourable dampness detected.";
  }

  if (state.weatherBonus < 0) {
    return "weather impact: amphibian comfort reduced.";
  }

  return "weather impact: neutral.";
}

function getBonusGreeting() {
  const messages = getContextMessages();

  if (!messages.length) return "";

  return getRandomMessage(messages);
}

function getContextMessages() {
  const messages = [];
  const day = new Date().getDay();
  const isWeekend = day === 0 || day === 6;

  if (isWeekend) {
    messages.push(...conditionalGreetings.weekend);
  }

  if (!isWeekend && state.currentLocation === "Home") {
    messages.push(...conditionalGreetings.remoteWork);
  }

  if (!isWeekend && state.currentLocation === "Office") {
    messages.push(...conditionalGreetings.officeWork);
  }

  if (state.currentLocation === "Gym Support") {
    messages.push(...conditionalGreetings.afterGym);
  }

  if (state.weatherBonus > 0) {
    messages.push(...conditionalGreetings.dampWeather);
  }

  if (state.weatherBonus < 0) {
    messages.push(...conditionalGreetings.hotWeather);
  }

  if (state.currentStreak >= 7) {
    messages.push(...conditionalGreetings.longStreak);
  }

  return messages;
}

function getCurrentTimeGreetingGroup() {
  const hour = new Date().getHours();

  return timeGreetingGroups.find(function (group) {
    return hour >= group.start && hour <= group.end;
  });
}

function getRandomMessage(messages) {
  return messages[randomNumber(0, messages.length - 1)];
}
