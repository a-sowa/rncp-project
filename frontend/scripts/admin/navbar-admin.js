// Injecte la navbar dans le container
fetch("../components/navbar-admin.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("navbar-container").innerHTML = html;

    // Initialise la déconnexion une fois le HTML chargé
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.href = "login.html";
      });
    }
  })
  .catch(err => {
    console.error("Erreur lors du chargement de la navbar admin :", err);
  });
