const apiKey = "b5e7b303947a42d79d5f6b6961a9984f";

const apiUrl = `https://newsapi.org/v2/top-headlines?sources=le-monde,le-figaro,france24,rfi&language=fr&pageSize=5&apiKey=b5e7b303947a42d79d5f6b6961a9984f`;


let titlesArray = [];

async function fetchNews() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.articles.length > 0) {
            const newsTable = document.getElementById("news-table");
            newsTable.innerHTML = "";

            data.articles.forEach((article) => {
                const row = document.createElement("tr");

                // Colonne du grand titre
                const titleCell = document.createElement("td");
                titleCell.textContent = article.title;
                row.appendChild(titleCell);

                newsTable.appendChild(row);
                titlesArray.push(article.title); // Ajouter les titres à un tableau
            });
        } else {
            console.log("Aucune actualité trouvée.");
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des actualités :", error);
    }
}

fetchNews();

// Fonction pour envoyer les titres au serveur Flask pour conversion en MP3
async function convertTitlesToMP3() {
    const response = await fetch("/generate_mp3", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: titlesArray.join(". ") }),
    });

    if (response.ok) {
        console.log("Conversion réussie. Fichier MP3 disponible.");
    } else {
        console.error("Erreur lors de la conversion en MP3");
    }
}

// Lier le bouton à la fonction de conversion
document
    .getElementById("convertBtn")
    .addEventListener("click", convertTitlesToMP3);

// Weather API
// weather.js

const weatherCard = document.getElementById('weather-card');
const apiMeteoKey = "20dc5ed9ac0e76fd63318305973434c1";  // ↪️ à remplacer

// Récupère la position de l’utilisateur
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude, longitude } = pos.coords;
    fetchWeather(latitude, longitude);
  }, () => {
    weatherCard.innerHTML = '<p>Impossible d\'obtenir la géoloc.</p>';
  });
} else {
  weatherCard.innerHTML = '<p>Géolocalisation non supportée.</p>';
}

function fetchWeather(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&lang=fr&units=metric&appid=${apiMeteoKey}`;
  fetch(url)
    .then(res => res.json())
    .then(data => displayWeather(data))
    .catch(() => {
      weatherCard.innerHTML = '<p>Erreur de chargement météo.</p>';
    });
}

function displayWeather(data) {
  const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  weatherCard.innerHTML = `
    <img src="${icon}" alt="${data.weather[0].description}" />
    <h3>${Math.round(data.main.temp)}°C</h3>
    <p>${data.weather[0].description}</p>
    <small>${data.name}</small>
  `;
}
 