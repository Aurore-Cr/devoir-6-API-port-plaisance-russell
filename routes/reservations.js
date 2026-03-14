const express = require("express");
const router = express.Router();
const Reservation = require("../models/Reservation");

// GET /reservations — liste toutes les réservations (onglet global)
router.get("/", async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ startDate: 1 });
    res.render("reservations/all", { reservations, error: null });
  } catch (err) {
    res.render("reservations/all", { reservations: [], error: err.message });
  }
});

module.exports = router;
