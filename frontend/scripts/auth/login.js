const form = document.getElementById("login-form");
const errorBox = document.getElementById("login-error");
const showPassword = document.getElementById("showPassword");

// Afficher/masquer mot de passe
showPassword.addEventListener("change", () => {
  const passwordField = document.getElementById("password");
  passwordField.type = showPassword.checked ? "text" : "password";
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = form.email.value.trim();
  const password = form.password.value.trim();

  errorBox.classList.add("hidden");
  errorBox.textContent = "";

  try {
    const res = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Échec de la connexion.");
    }

    const token = data.token;
    const payload = JSON.parse(atob(token.split(".")[1]));

    if (payload.role !== "user") {
      throw new Error("Cette page est réservée aux utilisateurs.");
    }

    // ✅ Stocker le token et rediriger
    localStorage.setItem("token", token);
    window.location.href = "index.html";

  } catch (err) {
    errorBox.textContent = err.message;
    errorBox.classList.remove("hidden");
  }
});
