// app.js
const express = require("express");
const cors = require("cors");
const app = express();

// Middlewares globaux
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/appointments", require("./routes/appointments"));
app.use("/api/users", require("./routes/users"));
app.use("/api/availability", require("./routes/availability"));


module.exports = app;
