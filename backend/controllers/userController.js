// controllers/userController.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");

/**
 * Crée un nouvel utilisateur (user ou admin)
 */
exports.register = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email déjà utilisé." });

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer et enregistrer l'utilisateur
    const newUser = new User({
      email,
      password: hashedPassword,
      role: role || "user"
    });

    await newUser.save();

    res.status(201).json({ message: "Utilisateur créé avec succès ✅", userId: newUser._id });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};
