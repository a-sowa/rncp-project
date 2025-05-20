const form = document.getElementById("register-form");
const errorBox = document.getElementById("register-error");
const successBox = document.getElementById("register-success");
const showPassword = document.getElementById("showPassword");

showPassword.addEventListener("change", () => {
  const type = showPassword.checked ? "text" : "password";
  document.getElementById("password").type = type;
  document.getElementById("confirmPassword").type = type;
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const firstName = form.firstName.value.trim();
  const lastName = form.lastName.value.trim();
  const email = form.email.value.trim();
  const password = form.password.value;
  const confirmPassword = form.confirmPassword.value;

  errorBox.classList.add("hidden");
  successBox.classList.add("hidden");

  // Vérification des champs
  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    return showError("Tous les champs sont requis.");
  }

  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
  if (!passwordRegex.test(password)) {
    return showError("Le mot de passe doit contenir entre 8 et 20 caractères, une lettre, un chiffre et un caractère spécial.");
  }

  if (password !== confirmPassword) {
    return showError("Les mots de passe ne correspondent pas.");
  }

  try {
    const res = await fetch("http://localhost:8080/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, password })
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Erreur lors de l’inscription.");

    successBox.textContent = "Inscription réussie ✅ Redirection...";
    successBox.classList.remove("hidden");
    form.reset();

    setTimeout(() => {
      window.location.href = "login.html";
    }, 2000);

  } catch (err) {
    showError(err.message);
  }
});

function showError(message) {
  errorBox.textContent = message;
  errorBox.classList.remove("hidden");
}
