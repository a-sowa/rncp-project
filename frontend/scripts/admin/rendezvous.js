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
  const pastList = document.getElementById("past-list");
  const errorBox = document.getElementById("error-msg");

  try {
    const res = await fetch("http://localhost:8080/api/appointments", {
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

    const today = new Date();
    const upcoming = data.appointments.filter(r => new Date(r.date) >= today && r.status !== "annulé");
    const past = data.appointments.filter(r => new Date(r.date) < today).reverse();

    const createCard = (r, isPast = false) => {
    const annulerBtn = (!isPast && r.status !== "annulé")
        ? `<button data-id="${r._id}" class="absolute top-2 right-2 bg-red-600 text-white text-sm px-3 py-1 rounded hover:bg-red-700">Annuler</button>`
        : "";

    const statut = r.status === "annulé"
        ? `<p class="text-red-600 text-sm font-semibold mt-2">Statut : Annulé</p>` : "";

    return `
        <div class="border border-gray-300 p-4 rounded relative">
        <p class="text-gray-800 font-medium">
            ${formatDate(r.date)} — ${r.startTime} → ${r.endTime} - ${r.service}
        </p>
        <p class="text-sm text-gray-500">${r.clientName} (${r.email})</p>
        ${statut}
        ${annulerBtn}
        </div>
    `;
    };


    upcomingList.innerHTML = upcoming.length
        ? upcoming.map(r => createCard(r, false)).join("")
        : `<p class="text-gray-500">Aucun rendez-vous à venir.</p>`;

    pastList.innerHTML = past.length
        ? past.map(r => createCard(r, true)).join("")
        : `<p class="text-gray-500">Aucun rendez-vous passé.</p>`;


    // Gestion bouton annulation
    document.querySelectorAll("button[data-id]").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        try {
          const res = await fetch(`http://localhost:8080/api/appointments/${id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          const result = await res.json();
          if (!res.ok) throw new Error(result.message || "Erreur");

          // Rechargement de la page
          window.location.reload();
        } catch (err) {
          errorBox.textContent = err.message;
          errorBox.classList.remove("hidden");
        }
      });
    });

  } catch (err) {
    errorBox.textContent = err.message;
    errorBox.classList.remove("hidden");
  }
});
