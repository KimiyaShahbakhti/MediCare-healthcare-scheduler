const mongoose = require("mongoose");

const Medicalnotes = mongoose.Schema(
  {
    problem: { type: String, required: true },
    text: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Medicalnotes", Medicalnotes);
