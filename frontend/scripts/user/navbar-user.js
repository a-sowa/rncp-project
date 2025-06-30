
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

    addLink("Accueil", "index.html");
    addLink("Prendre rendez-vous", "rendezvous.html");

    if (token) {
      addLink("Mes rendez-vous", "historique.html");
      addLink("Se déconnecter", "#", true, () => {
        localStorage.removeItem("token");
        window.location.href = "login.html";
      });
    } else {
      addLink("Se connecter", "login.html");
      addLink("S'inscrire", "register.html");
    }

    const burger = document.getElementById("burger");
    const menu = document.getElementById("nav-links");

    if (burger && menu) {
      burger.addEventListener("click", () => {
        menu.classList.toggle("hidden");
      });

      menu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
          if (window.innerWidth < 768) {
            menu.classList.add("hidden");
          }
        });
      });
    }
  })
  .catch(err => console.error("Erreur lors du chargement de la navbar utilisateur :", err));
