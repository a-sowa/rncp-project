const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "login.html";
} else {
  const payload = JSON.parse(atob(token.split(".")[1]));
  if (payload.role !== "admin") {
    window.location.href = "../login.html";
  }
}

const form = document.getElementById("slot-form");
const dateInput = document.getElementById("date");
const startInput = document.getElementById("startTime");
const endInput = document.getElementById("endTime");
const slotList = document.getElementById("slot-list");
const errorBox = document.getElementById("error-msg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorBox.classList.add("hidden");

  const dateVal = dateInput.value;
  const startVal = startInput.value;
  const endVal = endInput.value;

  if (!dateVal || !startVal || !endVal) {
    errorBox.textContent = "Tous les champs sont obligatoires.";
    errorBox.classList.remove("hidden");
    return;
  }

  // Vérification : le créneau ne doit pas être dans le passé
  const now = new Date();
  const slotStart = new Date(`${dateVal}T${startVal}`);
  const slotEnd = new Date(`${dateVal}T${endVal}`);

  if (slotEnd <= now) {
    errorBox.textContent = "Impossible d’ajouter un créneau dans le passé.";
    errorBox.classList.remove("hidden");
    return;
  }

  if (slotEnd <= slotStart) {
    errorBox.textContent = "L’heure de fin doit être postérieure à l’heure de début.";
    errorBox.classList.remove("hidden");
    return;
  }

  const body = {
    date: dateVal,
    startTime: startVal,
    endTime: endVal
  };

  try {
    const res = await fetch("http://localhost:8080/api/availability", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Erreur");

    form.reset();
    loadSlots();

  } catch (err) {
    errorBox.textContent = err.message;
    errorBox.classList.remove("hidden");
  }
});


async function loadSlots() {
  slotList.innerHTML = "";

  try {
    const res = await fetch("http://localhost:8080/api/availability", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Erreur");

    const sorted = data.availabilities.sort((a, b) => new Date(a.date) - new Date(b.date));

    sorted.forEach(slot => {
      const d = new Date(slot.date);
      const dateStr = d.toLocaleDateString("fr-FR");
      const card = document.createElement("div");
      card.className = "border p-4 rounded flex justify-between items-center";

      card.innerHTML = `
        <div>
          <p class="font-medium">${dateStr} — ${slot.startTime} → ${slot.endTime}</p>
          ${slot.isBooked ? `<p class="text-sm text-red-600">Réservé</p>` : ""}
        </div>
        ${!slot.isBooked ? `<button class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700" data-id="${slot._id}">Supprimer</button>` : ""}
      `;

      const btn = card.querySelector("button");
      if (btn) {
        btn.addEventListener("click", async () => {
          try {
            const res = await fetch(`http://localhost:8080/api/availability/${slot._id}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` }
            });

            if (!res.ok) throw new Error("Erreur lors de la suppression");
            loadSlots();
          } catch (err) {
            errorBox.textContent = err.message;
            errorBox.classList.remove("hidden");
          }
        });
      }

      slotList.appendChild(card);
    });

  } catch (err) {
    errorBox.textContent = err.message;
    errorBox.classList.remove("hidden");
  }
}

// Charger les créneaux au démarrage
document.addEventListener("DOMContentLoaded", loadSlots);
