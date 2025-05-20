const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Adresse email invalide"]
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 20
      // Note : la complexité du mot de passe est vérifiée dans le contrôleur
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
