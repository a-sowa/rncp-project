document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const container = document.getElementById("rdv-container");
  const guestMsg = document.getElementById("rdv-guest-message");

  //  Si non connecté → afficher message uniquement
  if (!token) {
    guestMsg.classList.remove("hidden");
    return;
  }

  //  Connecté → afficher le contenu
  container.classList.remove("hidden");

  const calendarInput = document.getElementById("calendar");
  const slotsList = document.getElementById("slots-list");
  const bookingForm = document.getElementById("booking-form");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const slotIdInput = document.getElementById("slotId");
  const bookingError = document.getElementById("booking-error");
  const bookingSuccess = document.getElementById("booking-success");

  let allSlots = [];
  let selectedSlot = null;

  // Charger les créneaux disponibles depuis l’API
  try {
    const res = await fetch("http://localhost:8080/api/availability", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await res.json();
    allSlots = data.availabilities.filter(slot => !slot.isBooked);
  } catch (err) {
    console.error("Erreur lors du chargement des créneaux :", err);
  }

  //  Préparer les dates à activer
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

  function showSlots(dateISO) {
    slotsList.innerHTML = "";

    const filtered = allSlots.filter(slot => {
      const slotDate = new Date(slot.date).toISOString().split("T")[0];
      return slotDate === dateISO;
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
        slotIdInput.value = slot._id;
        bookingForm.classList.remove("hidden");

        const payload = JSON.parse(atob(token.split(".")[1]));
        nameInput.value = `${payload.firstName || ""} ${payload.lastName || ""}`.trim();
        emailInput.value = payload.email || "";
      });

      slotsList.appendChild(card);
    });
  }

  bookingForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    bookingError.classList.add("hidden");
    bookingSuccess.classList.add("hidden");

    if (!selectedSlot) {
      bookingError.textContent = "Veuillez sélectionner un créneau.";
      bookingError.classList.remove("hidden");
      return;
    }

    const body = {
      clientName: nameInput.value,
      email: emailInput.value,
      service: "Consultation individuelle",
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

      const slotDate = new Date(selectedSlot.date).toLocaleDateString("fr-CA");
      const redirectUrl = `confirmation.html?date=${slotDate}&start=${selectedSlot.startTime}&end=${selectedSlot.endTime}&service=Consultation%20individuelle`;
      window.location.href = redirectUrl;

    } catch (err) {
      bookingError.textContent = err.message;
      bookingError.classList.remove("hidden");
    }
  });
});
