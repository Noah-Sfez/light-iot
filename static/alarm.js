// alarm.js
document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("setAlarmBtn");
    const msg = document.getElementById("alarmMsg");
    // ← Mets ici l’IP de ta Pico W
    const picoIp = "192.168.4.1";
    const endpoint = `http://${picoIp}/schedule_wakeup`;

    btn.addEventListener("click", () => {
        const time = document.getElementById("wake-time").value;
        if (!time) {
            msg.textContent = "❗ Choisis d'abord une heure.";
            return;
        }

        fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({ time }),
        })
            .then((res) => {
                if (!res.ok) throw new Error(`Statut ${res.status}`);
                return res.json();
            })
            .then((data) => {
                msg.textContent = `⏰ Réveil programmé à ${time} !`;
            })
            .catch((err) => {
                console.error("❌ Erreur:", err);
                msg.textContent = "❌ Impossible de contacter la Pico W.";
            });
    });
});
