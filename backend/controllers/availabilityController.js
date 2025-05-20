// controllers/availabilityController.js
const Availability = require("../models/Availability");

exports.createAvailability = async (req, res) => {
  try {
    const { date, startTime, endTime } = req.body;

    const existing = await Availability.findOne({ date, startTime, endTime });
    if (existing) {
      return res.status(400).json({ message: "Créneau déjà existant." });
    }

    const availability = new Availability({ date, startTime, endTime });
    await availability.save();

    res.status(201).json({ message: "Créneau ajouté ✅", availability });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

exports.getAvailabilities = async (req, res) => {
  try {
    const list = await Availability.find().sort({ date: 1, startTime: 1 });
    res.status(200).json({ availabilities: list });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

exports.deleteAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    await Availability.findByIdAndDelete(id);
    res.status(200).json({ message: "Créneau supprimé ✅" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};
