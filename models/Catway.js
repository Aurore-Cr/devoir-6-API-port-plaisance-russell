const mongoose = require("mongoose");

const catwaySchema = new mongoose.Schema({
  catwayNumber: {
    type: Number,
    required: [true, "Le numéro de catway est obligatoire"],
    unique: true,
    min: [1, "Le numéro doit être positif"],
  },
  catwayType: {
    type: String,
    enum: {
      values: ["long", "short"],
      message: "Le type doit être 'long' ou 'short'",
    },
    required: [true, "Le type est obligatoire"],
  },
  catwayState: {
    type: String,
    required: [true, "L'état est obligatoire"],
    trim: true,
  },
});

module.exports = mongoose.model("Catway", catwaySchema);
