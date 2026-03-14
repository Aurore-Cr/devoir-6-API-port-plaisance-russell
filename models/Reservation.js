const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  catwayNumber: {
    type: Number,
    required: [true, "Le numéro de catway est obligatoire"],
  },
  clientName: {
    type: String,
    required: [true, "Le nom du client est obligatoire"],
    trim: true,
  },
  boatName: {
    type: String,
    required: [true, "Le nom du bateau est obligatoire"],
    trim: true,
  },
  startDate: {
    type: Date,
    required: [true, "La date de début est obligatoire"],
  },
  endDate: {
    type: Date,
    required: [true, "La date de fin est obligatoire"],
  },
});

module.exports = mongoose.model("Reservation", reservationSchema);

reservationSchema.path("endDate").validate(function (value) {
  return value > this.startDate;
}, "La date de fin doit être après la date de début");

module.exports = mongoose.model("Reservation", reservationSchema);
