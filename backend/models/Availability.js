const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    isBooked: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// ➕ Empêche les doublons exacts
availabilitySchema.index(
  { date: 1, startTime: 1, endTime: 1 },
  { unique: true }
);

module.exports = mongoose.model("Availability", availabilitySchema);
