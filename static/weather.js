// weather.js

document.addEventListener("DOMContentLoaded", () => {
    const weatherCard = document.getElementById("weather-card");
    if (!weatherCard) {
        console.error("❌ Élément #weather-card introuvable");
        return;
    }

    const apiKey = "20dc5ed9ac0e76fd63318305973434c1";

    // Mapping conditions → emojis
    const weatherEmojis = {
        Clear: "☀️",
        Clouds: "☁️",
        Rain: "🌧️",
        Drizzle: "🌦️",
        Thunderstorm: "⛈️",
        Snow: "❄️",
        Mist: "🌫️",
        Smoke: "💨",
        Haze: "🌫️",
        Dust: "🌪️",
        Fog: "🌫️",
        Sand: "🏜️",
        Ash: "🌋",
        Squall: "🌬️",
        Tornado: "🌪️",
    };

    // 1️⃣ Géolocalisation
    if (!navigator.geolocation) {
        weatherCard.textContent = "Géolocalisation non supportée 😕";
        return;
    }
    navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError);

    function onGeoSuccess(pos) {
        const { latitude, longitude } = pos.coords;
        console.log(`📍 Position : ${latitude}, ${longitude}`);
        fetchWeather(latitude, longitude);
    }

    function onGeoError(err) {
        console.error("❌ Erreur géoloc :", err);
        weatherCard.textContent = "Impossible d’obtenir la géoloc 😢";
    }

    // 2️⃣ Récupération météo
    function fetchWeather(lat, lon) {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&lang=fr&units=metric&appid=${apiKey}`;
        console.log("🔗 Requête météo =>", url);

        fetch(url)
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then((data) => {
                console.log("✅ Données météo =>", data);
                displayWeather(data);
            })
            .catch((err) => {
                console.error("❌ Erreur chargement météo :", err);
                weatherCard.textContent = "Erreur de chargement météo 😭";
            });
    }

    // 3️⃣ Affichage
    function displayWeather(data) {
        if (data.cod && data.cod !== 200) {
            weatherCard.innerHTML = `<p>Erreur API : ${data.message}</p>`;
            return;
        }

        const main = data.weather[0].main;
        const emoji = weatherEmojis[main] || "🌈";
        const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;

        weatherCard.innerHTML = `
      <div class="weather-emoji">${emoji}</div>
      <h3>${Math.round(data.main.temp)}°C</h3>
      <p class="weather-desc">${data.weather[0].description}</p>
      <small>${data.name}</small>
    `;
    }
});
