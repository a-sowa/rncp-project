// routes/availability.js
const express = require("express");
const router = express.Router();
const availabilityController = require("../controllers/availabilityController");
const verifyToken = require("../middleware/verifyToken");
const checkRole = require("../middleware/checkRole");

// Accessible à tous (lecture)
router.get("/", availabilityController.getAvailabilities);

// Réservé à l'admin
router.post("/", verifyToken, checkRole("admin"), availabilityController.createAvailability);
router.delete("/:id", verifyToken, checkRole("admin"), availabilityController.deleteAvailability);

module.exports = router;
