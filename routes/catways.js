const express = require("express");
const router = express.Router();
const Catway = require("../models/Catway");
const Reservation = require("../models/Reservation");

//  CATWAYS

// GET /catways
router.get("/", async (req, res) => {
  try {
    const catways = await Catway.find().sort({ catwayNumber: 1 });
    res.render("catways/index", { catways, error: null });
  } catch (err) {
    res.render("catways/index", { catways: [], error: err.message });
  }
});

// GET /catways/new
router.get("/new", (req, res) => {
  res.render("catways/new", { error: null });
});

// POST /catways
router.post("/", async (req, res) => {
  try {
    await new Catway(req.body).save();
    res.redirect("/catways");
  } catch (err) {
    res.render("catways/new", { error: err.message });
  }
});

// GET /catways/:id
router.get("/:id", async (req, res) => {
  try {
    const catway = await Catway.findOne({ catwayNumber: req.params.id });
    if (!catway) return res.redirect("/catways");
    const reservations = await Reservation.find({
      catwayNumber: req.params.id,
    }).sort({ startDate: 1 });
    res.render("catways/show", { catway, reservations });
  } catch (err) {
    res.redirect("/catways");
  }
});

// GET /catways/:id/edit
router.get("/:id/edit", async (req, res) => {
  try {
    const catway = await Catway.findOne({ catwayNumber: req.params.id });
    if (!catway) return res.redirect("/catways");
    res.render("catways/edit", { catway, error: null });
  } catch (err) {
    res.redirect("/catways");
  }
});

// POST /catways/:id/edit — seul catwayState est modifiable
router.post("/:id/edit", async (req, res) => {
  try {
    await Catway.findOneAndUpdate(
      { catwayNumber: req.params.id },
      { catwayState: req.body.catwayState },
      { new: true, runValidators: true },
    );
    res.redirect("/catways/" + req.params.id);
  } catch (err) {
    const catway = await Catway.findOne({ catwayNumber: req.params.id });
    res.render("catways/edit", { catway, error: err.message });
  }
});

// POST /catways/:id/delete
router.post("/:id/delete", async (req, res) => {
  try {
    await Catway.findOneAndDelete({ catwayNumber: req.params.id });
    res.redirect("/catways");
  } catch (err) {
    res.redirect("/catways");
  }
});

//  RÉSERVATIONS LIÉES À UN CATWAY

// GET /catways/:id/reservations
router.get("/:id/reservations", async (req, res) => {
  try {
    const catway = await Catway.findOne({ catwayNumber: req.params.id });
    if (!catway) return res.redirect("/catways");
    const reservations = await Reservation.find({
      catwayNumber: req.params.id,
    }).sort({ startDate: 1 });
    res.render("reservations/index", { catway, reservations });
  } catch (err) {
    res.redirect("/catways");
  }
});

// GET /catways/:id/reservations/new
router.get("/:id/reservations/new", async (req, res) => {
  try {
    const catway = await Catway.findOne({ catwayNumber: req.params.id });
    if (!catway) return res.redirect("/catways");
    res.render("reservations/new", { catway, error: null });
  } catch (err) {
    res.redirect("/catways");
  }
});

// POST /catways/:id/reservations
router.post("/:id/reservations", async (req, res) => {
  try {
    await new Reservation({ ...req.body, catwayNumber: req.params.id }).save();
    res.redirect("/catways/" + req.params.id + "/reservations");
  } catch (err) {
    const catway = await Catway.findOne({ catwayNumber: req.params.id });
    res.render("reservations/new", { catway, error: err.message });
  }
});

// GET /catways/:id/reservations/:idReservation
router.get("/:id/reservations/:idReservation", async (req, res) => {
  try {
    const catway = await Catway.findOne({ catwayNumber: req.params.id });
    const reservation = await Reservation.findById(req.params.idReservation);
    if (!catway || !reservation)
      return res.redirect("/catways/" + req.params.id + "/reservations");
    res.render("reservations/show", { catway, reservation });
  } catch (err) {
    res.redirect("/catways/" + req.params.id + "/reservations");
  }
});

// GET /catways/:id/reservations/:idReservation/edit
router.get("/:id/reservations/:idReservation/edit", async (req, res) => {
  try {
    const catway = await Catway.findOne({ catwayNumber: req.params.id });
    const reservation = await Reservation.findById(req.params.idReservation);
    if (!catway || !reservation)
      return res.redirect("/catways/" + req.params.id + "/reservations");
    res.render("reservations/edit", { catway, reservation, error: null });
  } catch (err) {
    res.redirect("/catways/" + req.params.id + "/reservations");
  }
});

// POST /catways/:id/reservations/:idReservation/edit
router.post("/:id/reservations/:idReservation/edit", async (req, res) => {
  try {
    await Reservation.findByIdAndUpdate(req.params.idReservation, req.body, {
      new: true,
      runValidators: true,
    });
    res.redirect(
      "/catways/" + req.params.id + "/reservations/" + req.params.idReservation,
    );
  } catch (err) {
    const catway = await Catway.findOne({ catwayNumber: req.params.id });
    const reservation = await Reservation.findById(req.params.idReservation);
    res.render("reservations/edit", {
      catway,
      reservation,
      error: err.message,
    });
  }
});

// POST /catways/:id/reservations/:idReservation/delete
router.post("/:id/reservations/:idReservation/delete", async (req, res) => {
  try {
    await Reservation.findByIdAndDelete(req.params.idReservation);
    res.redirect("/catways/" + req.params.id + "/reservations");
  } catch (err) {
    res.redirect("/catways/" + req.params.id + "/reservations");
  }
});

module.exports = router;
