const form = document.getElementById("admin-login-form");
const errorBox = document.getElementById("login-error");
const togglePassword = document.getElementById("toggle-password");
const passwordInput = document.getElementById("password");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = form.email.value.trim();
  const password = form.password.value.trim();

  errorBox.textContent = '';
  errorBox.classList.add("hidden");

  try {
    const res = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Erreur");

    // Vérification du rôle
    const token = data.token;
    const payload = JSON.parse(atob(token.split(".")[1]));

    if (payload.role !== "admin") {
      throw new Error("Accès réservé aux administrateurs.");
    }

    localStorage.setItem("token", token);
    window.location.href = "dashboard.html";

  } catch (err) {
    errorBox.textContent = err.message;
    errorBox.classList.remove("hidden");
  }
});

// Afficher/masquer le mot de passe
togglePassword.addEventListener("click", () => {
  passwordInput.type = passwordInput.type === "password" ? "text" : "password";
});
