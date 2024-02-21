const mongoose = require("mongoose")

const Medicalservices = mongoose.Schema(
  {
    service: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Medicalservices", Medicalservices);
