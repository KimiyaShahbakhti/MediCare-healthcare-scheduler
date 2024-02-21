const mongoose = require("mongoose");

const Problems = mongoose.Schema(
  {
    problem: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model("Problems", Problems);
