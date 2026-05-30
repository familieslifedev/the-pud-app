import { state } from "./state.js";
import { settings } from "./settings.js";
import { updateApproval } from "./approval.js";
import { savePudData, setText } from "./storage.js";

export function getWeather() {
  if (!settings.weatherEnabled) {
    clearWeatherDisplay("Weather disabled in settings.");
    return;
  }

  if (!navigator.geolocation) {
    clearWeatherDisplay("Geolocation not supported.");
    return;
  }

  setText("weatherStatus", "Requesting location...");

  navigator.geolocation.getCurrentPosition(
    function (position) {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      fetchWeather(
        lat,
        lon,
        `Current Location (${lat.toFixed(2)}, ${lon.toFixed(2)})`,
      );
    },
    function () {
      clearWeatherDisplay("Location permission denied.");
    },
  );
}

export async function fetchWeather(latitude, longitude, locationName = null) {
  if (!settings.weatherEnabled) {
    clearWeatherDisplay("Weather disabled in settings.");
    return;
  }

  setText("weatherStatus", "Fetching weather...");

  if (locationName) {
    setText("weatherLocation", locationName);
  } else {
    setText(
      "weatherLocation",
      `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`,
    );
  }

  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${latitude}` +
    `&longitude=${longitude}` +
    `&current=temperature_2m,precipitation,weather_code` +
    `&timezone=auto`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const current = data.current;
    const temperature = current.temperature_2m;
    const precipitation = current.precipitation;
    const weatherCode = current.weather_code;

    setText("weatherTemp", Math.round(temperature));

    applyWeatherBonus(weatherCode, precipitation, temperature);

    savePudData();
  } catch (error) {
    console.error("Weather fetch failed:", error);
    clearWeatherDisplay("Weather fetch failed.");
  }
}

export function applyWeatherBonus(weatherCode, precipitation, temperature) {
  let status = "Unknown conditions";
  state.weatherBonus = 0;

  if (precipitation > 0) {
    status = "Rain detected. Pud is thriving.";
    state.weatherBonus = 10;
  } else if (weatherCode === 0) {
    status = "Clear skies. Acceptable amphibian visibility.";
    state.weatherBonus = 2;
  } else if (weatherCode >= 1 && weatherCode <= 3) {
    status = "Cloud coverage detected. Mild dampness vibes.";
    state.weatherBonus = 4;
  } else if (weatherCode >= 45 && weatherCode <= 48) {
    status = "Fog detected. Cryptid mode engaged.";
    state.weatherBonus = 6;
  }

  if (temperature >= 26) {
    status = "Heat detected. Pud stability reduced.";
    state.weatherBonus -= 6;
  }

  if (temperature <= 6) {
    status = "Cold detected. Pud requests blanket support.";
    state.weatherBonus -= 3;
  }

  setText("weatherStatus", status);
  setText("weatherBonus", state.weatherBonus);

  updateApproval();
}

export async function searchWeatherLocation() {
  if (!settings.weatherEnabled) {
    clearWeatherDisplay("Weather disabled in settings.");
    return;
  }

  const input = document.getElementById("weatherSearchInput");
  const query = input ? input.value.trim() : "";

  if (query === "") {
    clearWeatherDisplay("Enter a location first.");
    return;
  }

  setText("weatherStatus", "Searching location...");

  const url =
    `https://geocoding-api.open-meteo.com/v1/search` +
    `?name=${encodeURIComponent(query)}` +
    `&count=1` +
    `&language=en` +
    `&format=json`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      clearWeatherDisplay("No location found.");
      return;
    }

    const place = data.results[0];
    const locationName = `${place.name}, ${place.country}`;

    fetchWeather(place.latitude, place.longitude, locationName);
  } catch (error) {
    console.error("Location search failed:", error);
    clearWeatherDisplay("Location search failed.");
  }
}

export function loadPreferredWeather() {
  if (!settings.weatherEnabled) {
    clearWeatherDisplay("Weather disabled in settings.");
    return;
  }

  const input = document.getElementById("weatherSearchInput");

  if (!settings.preferredLocation) {
    if (input) {
      input.value = "";
    }

    clearWeatherDisplay("Not loaded");
    return;
  }

  if (input) {
    input.value = settings.preferredLocation;
  }

  searchWeatherLocation();
}

export function clearWeatherDisplay(message = "Not loaded") {
  setText("weatherStatus", message);
  setText("weatherLocation", "Unknown");
  setText("weatherTemp", "--");
  setText("weatherBonus", "0");

  state.weatherBonus = 0;
  updateApproval();
}

export function syncWeatherInputs() {
  const weatherSearchInput = document.getElementById("weatherSearchInput");

  if (weatherSearchInput && !settings.preferredLocation) {
    weatherSearchInput.value = "";
  }
}
