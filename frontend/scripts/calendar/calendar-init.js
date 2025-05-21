document.addEventListener("DOMContentLoaded", () => {
  const calendar = document.getElementById("calendar");
  const slotsList = document.getElementById("slots-list");
  const errorBox = document.getElementById("availability-error");

  let allSlots = [];

  // Charger tous les créneaux disponibles à l'avance
  async function fetchSlots() {
    try {
      const res = await fetch("http://localhost:8080/api/availability");
      const data = await res.json();
      allSlots = data.availabilities || [];
    } catch (err) {
      errorBox.textContent = "Impossible de charger les créneaux.";
      errorBox.classList.remove("hidden");
    }
  }

  // Afficher les créneaux pour une date donnée
  function displaySlotsForDate(dateStr) {
    slotsList.innerHTML = "";

    const filtered = allSlots.filter(slot => {
      const slotDate = new Date(slot.date).toISOString().split("T")[0];
      return slotDate === dateStr;
    });

    if (filtered.length === 0) {
      slotsList.innerHTML = `<p class="text-gray-500">Aucun créneau disponible ce jour-là.</p>`;
      return;
    }

    filtered.forEach(slot => {
      const card = document.createElement("div");
      card.className = "border border-gray-300 rounded p-4 flex justify-between items-center";

      const time = `${slot.startTime} → ${slot.endTime}`;
      card.innerHTML = `
        <div>
          <p class="font-semibold text-gray-800">${time}</p>
          <p class="text-sm text-gray-500">${new Date(slot.date).toLocaleDateString("fr-FR")}</p>
        </div>
        <a href="rendezvous.html?slotId=${slot._id}" class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          Réserver
        </a>
      `;

      slotsList.appendChild(card);
    });
  }
  console.log("Initialisation du calendrier…", calendar);


  // Initialiser le calendrier
  flatpickr(calendar, {
    minDate: "today",
    dateFormat: "Y-m-d",
    onChange: function (selectedDates, dateStr) {
      displaySlotsForDate(dateStr);
    }
  });

  fetchSlots();
});
