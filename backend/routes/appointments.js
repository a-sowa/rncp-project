const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");
const verifyToken = require("../middleware/verifyToken");
const checkRole = require("../middleware/checkRole");

// Créer un rendez-vous (utilisateur connecté)
router.post("/", verifyToken, appointmentController.createAppointment);

// Voir tous les rendez-vous (admin uniquement)
router.get("/", verifyToken, checkRole("admin"), appointmentController.getAllAppointments);

// Voir ses propres rendez-vous (utilisateur connecté)
router.get("/my", verifyToken, appointmentController.getMyAppointments);

router.delete("/:id", verifyToken, checkRole("admin"), appointmentController.cancelAppointment);


module.exports = router;
