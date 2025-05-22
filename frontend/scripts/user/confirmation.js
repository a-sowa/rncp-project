document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const date = params.get("date");
  const startTime = params.get("start");
  const endTime = params.get("end");
  const service = params.get("service");

    if (date) {
        const [y, m, d] = date.split("-");
        document.getElementById("confirm-date").textContent = `${d}/${m}/${y}`;
    } else {
        document.getElementById("confirm-date").textContent = "Non spécifiée";
    }

  document.getElementById("confirm-time").textContent = startTime && endTime ? `${startTime} → ${endTime}` : "Non spécifiée";
  document.getElementById("confirm-service").textContent = service || "Non spécifié";
});

