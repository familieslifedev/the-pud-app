function getWeather() {
    if (!settings.weatherEnabled) {
        document.getElementById("weatherStatus").textContent =
            "Weather disabled in settings.";
        return;
    }

    if (!navigator.geolocation) {
        document.getElementById("weatherStatus").textContent =
            "Geolocation not supported.";
        return;
    }

    document.getElementById("weatherStatus").textContent =
        "Requesting location...";

    navigator.geolocation.getCurrentPosition(
        function (position) {
            fetchWeather(
                position.coords.latitude,
                position.coords.longitude,
                "Current Location"
            );
        },
        function () {
            document.getElementById("weatherStatus").textContent =
                "Location permission denied.";
        }
    );
}

async function fetchWeather(latitude, longitude, locationName = null) {
    document.getElementById("weatherStatus").textContent =
        "Fetching weather...";

    if (locationName) {
        document.getElementById("weatherLocation").textContent = locationName;
    } else {
        document.getElementById("weatherLocation").textContent =
            `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
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

        document.getElementById("weatherTemp").textContent =
            Math.round(temperature);

        applyWeatherBonus(weatherCode, precipitation, temperature);

        savePudData();
    } catch (error) {
        console.error("Weather fetch failed:", error);

        document.getElementById("weatherStatus").textContent =
            "Weather fetch failed.";
    }
}

function applyWeatherBonus(weatherCode, precipitation, temperature) {
    let status = "Unknown conditions";
    weatherBonus = 0;

    if (precipitation > 0) {
        status = "Rain detected. Pud is thriving.";
        weatherBonus = 10;
    } else if (weatherCode === 0) {
        status = "Clear skies. Acceptable amphibian visibility.";
        weatherBonus = 2;
    } else if (weatherCode >= 1 && weatherCode <= 3) {
        status = "Cloud coverage detected. Mild dampness vibes.";
        weatherBonus = 4;
    } else if (weatherCode >= 45 && weatherCode <= 48) {
        status = "Fog detected. Cryptid mode engaged.";
        weatherBonus = 6;
    }

    if (temperature >= 26) {
        status = "Heat detected. Pud stability reduced.";
        weatherBonus -= 6;
    }

    if (temperature <= 3) {
        status = "Cold detected. Pud requests blanket support.";
        weatherBonus -= 3;
    }

    document.getElementById("weatherStatus").textContent = status;
    document.getElementById("weatherBonus").textContent = weatherBonus;

    updateApproval();
}

async function searchWeatherLocation() {
    if (!settings.weatherEnabled) {
        document.getElementById("weatherStatus").textContent =
            "Weather disabled in settings.";
        return;
    }

    const query = document.getElementById("weatherSearchInput").value.trim();

    if (query === "") {
        document.getElementById("weatherStatus").textContent =
            "Enter a location first.";
        return;
    }

    settings.preferredLocation = query;
    savePudData();

    document.getElementById("weatherStatus").textContent =
        "Searching location...";

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
            document.getElementById("weatherStatus").textContent =
                "No location found.";
            return;
        }

        const place = data.results[0];
        const locationName = `${place.name}, ${place.country}`;

        fetchWeather(place.latitude, place.longitude, locationName);
    } catch (error) {
        console.error("Location search failed:", error);

        document.getElementById("weatherStatus").textContent =
            "Location search failed.";
    }
}