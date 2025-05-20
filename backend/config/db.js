// config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connecté à MongoDB");
  } catch (err) {
    console.error("❌ Erreur de connexion MongoDB :", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
