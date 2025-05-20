// routes/appointments.js
const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");
const verifyToken = require("../middleware/verifyToken");
const checkRole = require("../middleware/checkRole");

// Créer un rendez-vous (user ou invité connecté)
router.post("/", verifyToken, appointmentController.createAppointment);

// Voir tous les rendez-vous (admin uniquement)
router.get("/", verifyToken, checkRole("admin"), appointmentController.getAllAppointments);

module.exports = router;
