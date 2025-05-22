fetch("components/navbar-user.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("navbar-container").innerHTML = html;

    const navLinks = document.getElementById("nav-links");
    const token = localStorage.getItem("token");

    const addLink = (text, href, isButton = false, onClick = null) => {
      const li = document.createElement("li");

      if (isButton) {
        const btn = document.createElement("button");
        btn.textContent = text;
        btn.className = "text-gray-700 hover:text-red-600";
        btn.onclick = onClick;
        li.appendChild(btn);
      } else {
        const a = document.createElement("a");
        a.textContent = text;
        a.href = href;
        a.className = "text-gray-700 hover:text-indigo-700";
        li.appendChild(a);
      }

      navLinks.appendChild(li);
    };

    // Liens communs à tous
    addLink("Accueil", "index.html");
    addLink("Prendre rendez-vous", "rendezvous.html");

    if (token) {
      // Connecté : liens user
      addLink("Mes rendez-vous", "historique.html");
      addLink("Se déconnecter", "#", true, () => {
        localStorage.removeItem("token");
        window.location.href = "login.html";
      });
    } else {
      // Non connecté : login et inscription
      addLink("Se connecter", "login.html");
      addLink("S'inscrire", "register.html");
    }
  })
  .catch(err => console.error("Erreur lors du chargement de la navbar utilisateur :", err));
