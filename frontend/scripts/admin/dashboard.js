const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "login.html";
} else {
  const payload = JSON.parse(atob(token.split(".")[1]));
  if (payload.role !== "admin") {
    window.location.href = "../login.html";
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const upcomingList = document.getElementById("upcoming-list");
  const errorBox = document.getElementById("error-msg");

  try {
    const res = await fetch("http://localhost:8080/api/appointments", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Erreur lors du chargement");

    const formatDate = (dateStr) => {
      const [y, m, d] = dateStr.split("T")[0].split("-");
      return `${d}/${m}/${y}`;
    };

    const isToday = (dateStr) => {
      const today = new Date();
      const target = new Date(dateStr);
      return (
        today.getFullYear() === target.getFullYear() &&
        today.getMonth() === target.getMonth() &&
        today.getDate() === target.getDate()
      );
    };

    const todayAppointments = data.appointments.filter(r => isToday(r.date));

    const createCard = (r) => `
      <div class="border border-gray-300 p-4 rounded">
        <p class="text-gray-800 font-medium">
          ${formatDate(r.date)} — ${r.startTime} → ${r.endTime} - ${r.service}
        </p>
        <p class="text-sm text-gray-500">${r.clientName} (${r.email})</p>
      </div>
    `;

    upcomingList.innerHTML = todayAppointments.length
      ? todayAppointments.map(createCard).join("")
      : `<p class="text-gray-500">Aucun rendez-vous prévu aujourd'hui.</p>`;

  } catch (err) {
    errorBox.textContent = err.message;
    errorBox.classList.remove("hidden");
  }
});
