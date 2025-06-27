const Appointment = require("../models/Appointment");
const Availability = require("../models/Availability");

// Créer un nouveau rendez-vous
exports.createAppointment = async (req, res) => {
  try {
    const { clientName, email, service, slotId } = req.body;
    const userId = req.user.id;

    // Vérifier si le créneau existe et est libre
    const slot = await Availability.findById(slotId);
    if (!slot) {
      return res.status(404).json({ message: "Créneau inexistant." });
    }
    if (slot.isBooked) {
      return res.status(400).json({ message: "Créneau déjà réservé." });
    }

    // Marquer le créneau comme réservé
    slot.isBooked = true;
    await slot.save();

    // Enregistrer le rendez-vous
    const newAppointment = new Appointment({
        clientName,
        email,
        service,
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        userId
    });


    await newAppointment.save();

    res.status(201).json({
      message: "Rendez-vous confirmé ✅",
      appointment: newAppointment
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

//  Voir tous les rendez-vous (admin uniquement)
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ date: 1 });
    res.status(200).json({ appointments });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

//  Voir les rendez-vous d’un utilisateur connecté
exports.getMyAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    const all = await Appointment.find({ userId }).sort({ date: 1 });

    const today = new Date();
    const upcoming = all.filter(r => new Date(r.date) >= today);
    const past = all.filter(r => new Date(r.date) < today).reverse();

    res.status(200).json({ upcoming, past });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

exports.cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const rdv = await Appointment.findByIdAndUpdate(id, { status: "annulé" }, { new: true });
    if (!rdv) return res.status(404).json({ message: "Rendez-vous introuvable" });
    res.status(200).json({ message: "Rendez-vous annulé ✅", rdv });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

