const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
    console.log("Données reçues pour inscription :", req.body);
  const { firstName, lastName, email, password } = req.body;

  try {
    // 🔒 Validation manuelle du mot de passe
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,20}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Le mot de passe doit contenir entre 8 et 20 caractères, incluant au moins une lettre, un chiffre et un caractère spécial."
      });
    }

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires." });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Cet e-mail est déjà utilisé." });
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer et enregistrer le nouvel utilisateur
    const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: "user" // Forcé ici, l’utilisateur ne choisit pas son rôle
    });


    await newUser.save();

    res.status(201).json({ message: "Utilisateur créé avec succès ✅", userId: newUser._id });
  } catch (err) {
        console.error("⛔ Erreur dans register:", err); // 👈 Log complet
        res.status(500).json({ message: "Erreur serveur", error: err.message });
    }

};
