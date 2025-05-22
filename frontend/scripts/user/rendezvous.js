const calendarInput = document.getElementById("calendar");
const slotsList = document.getElementById("slots-list");
const bookingForm = document.getElementById("booking-form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const slotIdInput = document.getElementById("slotId");
const errorBox = document.getElementById("booking-error");
const successBox = document.getElementById("booking-success");

let allSlots = [];
let selectedSlot = null;
let token = localStorage.getItem("token");
let userData = null;

async function fetchSlots() {
  try {
    const res = await fetch("http://localhost:8080/api/availability");
    const data = await res.json();
    allSlots = data.availabilities || [];
    return allSlots;
  } catch (err) {
    console.error("Erreur lors du chargement des créneaux :", err);
    allSlots = [];
  }
}

function showSlots(dateISO) {
  slotsList.innerHTML = "";

  const filtered = allSlots.filter(slot => {
    const slotDate = new Date(slot.date).toISOString().split("T")[0];
    return slotDate === dateISO && !slot.isBooked;
  });

  if (filtered.length === 0) {
    slotsList.innerHTML = `<p class="text-gray-500">Aucun créneau disponible pour cette date.</p>`;
    return;
  }

  filtered.forEach(slot => {
    const card = document.createElement("div");
    card.className = "border border-gray-300 rounded p-4 flex justify-between items-center";

    card.innerHTML = `
      <div>
        <p class="font-semibold text-gray-800">${slot.startTime} → ${slot.endTime}</p>
        <p class="text-sm text-gray-500">${new Date(slot.date).toLocaleDateString("fr-FR")}</p>
      </div>
      <button class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700" data-id="${slot._id}">
        Choisir
      </button>
    `;

    card.querySelector("button").addEventListener("click", () => {
      selectedSlot = slot;
      bookingForm.classList.remove("hidden");
      slotIdInput.value = slot._id;
    });

    slotsList.appendChild(card);
  });
}

// Vérifie si l'utilisateur est connecté
if (!token) {
  window.location.href = "login.html";
} else {
  const payload = JSON.parse(atob(token.split(".")[1]));
  userData = payload;
  nameInput.value = `${payload.firstName || ""} ${payload.lastName || ""}`.trim();
  emailInput.value = payload.email || "";
}

document.addEventListener("DOMContentLoaded", async () => {
  await fetchSlots();

  const uniqueISOStrings = [...new Set(allSlots.map(slot => new Date(slot.date).toDateString()))];
  const enabledDates = uniqueISOStrings.map(dateStr => new Date(dateStr));

  flatpickr(calendarInput, {
    minDate: "today",
    dateFormat: "d/m/Y",
    locale: "fr",
    enable: enabledDates,
    onChange: function (selectedDates, dateStr) {
      const [d, m, y] = dateStr.split("/");
      const isoDate = `${y}-${m}-${d}`;
      showSlots(isoDate);
    },
    onReady: function (_, __, instance) {
      const todayISO = new Date().toISOString().split("T")[0];
      const today = new Date(todayISO);
      if (enabledDates.some(date => date.toDateString() === today.toDateString())) {
        const [y, m, d] = todayISO.split("-");
        instance.setDate(`${d}/${m}/${y}`, true);
        showSlots(todayISO);
      }
    }
  });
});

// Envoi de la réservation
bookingForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorBox.classList.add("hidden");
  successBox.classList.add("hidden");

  if (!selectedSlot) {
    errorBox.textContent = "Veuillez sélectionner un créneau.";
    errorBox.classList.remove("hidden");
    return;
  }

  const body = {
    clientName: nameInput.value,
    email: emailInput.value,
    service: "Consultation individuelle", // champ fixé
    slotId: selectedSlot._id
  };

  try {
    const res = await fetch("http://localhost:8080/api/appointments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Erreur lors de la réservation");

    // Redirection
    const slotDate = new Date(selectedSlot.date).toLocaleDateString("fr-CA");
    const redirectUrl = `confirmation.html?date=${slotDate}&start=${selectedSlot.startTime}&end=${selectedSlot.endTime}&service=Consultation%20individuelle`;
    window.location.href = redirectUrl;

  } catch (err) {
    errorBox.textContent = err.message;
    errorBox.classList.remove("hidden");
  }
});

