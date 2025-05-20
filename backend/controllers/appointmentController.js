// controllers/appointmentController.js
const Appointment = require("../models/Appointment");

exports.createAppointment = async (req, res) => {
  try {
    const { clientName, email, service, date } = req.body;

    const newAppointment = new Appointment({
      clientName,
      email,
      service,
      date
    });

    await newAppointment.save();
    res.status(201).json({ message: "Rendez-vous enregistré ✅", appointment: newAppointment });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de l'enregistrement", error: err.message });
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
