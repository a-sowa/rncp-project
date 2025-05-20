// app.js
const express = require("express");
const cors = require("cors");
const app = express();

// Middlewares globaux
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));

// (Tu ajouteras ici les autres routes plus tard)

module.exports = app;
