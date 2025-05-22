const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", async () => {
  const upcomingList = document.getElementById("upcoming-list");
  const pastList = document.getElementById("past-list");
  const errorBox = document.getElementById("error-msg");

  try {
    const res = await fetch("http://localhost:8080/api/appointments/my", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Erreur lors du chargement");

    const formatDate = dateStr => {
      const [y, m, d] = dateStr.split("T")[0].split("-");
      return `${d}/${m}/${y}`;
    };

    const createCard = (appt) => {
      return `
        <div class="border border-gray-300 p-4 rounded">
          <p class="text-gray-800 font-medium">${formatDate(appt.date)} - ${appt.startTime} → ${appt.endTime} - ${appt.service}</p>
          <p class="text-sm text-gray-500">${appt.clientName} - ${appt.email}</p>
        </div>
      `;
    };

    upcomingList.innerHTML = data.upcoming.length
      ? data.upcoming.map(createCard).join("")
      : `<p class="text-gray-500">Aucun rendez-vous à venir.</p>`;

    pastList.innerHTML = data.past.length
      ? data.past.map(createCard).join("")
      : `<p class="text-gray-500">Aucun rendez-vous passé.</p>`;

  } catch (err) {
    errorBox.textContent = err.message;
    errorBox.classList.remove("hidden");
  }
});
