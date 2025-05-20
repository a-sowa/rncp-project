// models/Appointment.js
const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: true },
    email: { type: String, required: true },
    service: { type: String, required: true },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["en attente", "confirmé", "annulé"],
      default: "en attente"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
