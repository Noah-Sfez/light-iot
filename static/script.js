// Clé API de NewsAPI (tu devras remplacer par ta propre clé API)
const apiKey = "b5e7b303947a42d79d5f6b6961a9984f";


// URL de l'API pour récupérer les 5 dernières actualités
const apiUrl = `https://newsapi.org/v2/top-headlines?sources=le-monde,le-figaro,france24,rfi&language=fr&pageSize=5&apiKey=b5e7b303947a42d79d5f6b6961a9984f`;


let titlesArray = [];

async function fetchNews() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.articles.length > 0) {
            const newsTable = document.getElementById("news-table");
            newsTable.innerHTML = ""; // Réinitialiser le tableau

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