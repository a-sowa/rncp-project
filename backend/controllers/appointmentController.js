const Appointment = require("../models/Appointment");
const Availability = require("../models/Availability");

exports.createAppointment = async (req, res) => {
  try {
    const { clientName, email, service, date } = req.body;

    // Cherche et réserve en une seule opération (atomique)
    const slot = await Availability.findOneAndUpdate(
      { date, isBooked: false },
      { isBooked: true },
      { new: true }
    );

    if (!slot) {
      return res.status(400).json({ message: "Créneau déjà réservé ou inexistant." });
    }

    const newAppointment = new Appointment({
      clientName,
      email,
      service,
      date
    });

    await newAppointment.save();

    res.status(201).json({ message: "Rendez-vous confirmé ✅", appointment: newAppointment });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};


exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ date: 1 });
    res.status(200).json({ appointments });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};
