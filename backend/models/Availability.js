// models/Availability.js
const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    startTime: { type: String, required: true }, // ex: "10:00"
    endTime: { type: String, required: true }     // ex: "11:00"
  },
  { timestamps: true }
);

module.exports = mongoose.model("Availability", availabilitySchema);
