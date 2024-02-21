const mongoose = require("mongoose");

const Pharmacy = mongoose.Schema(
  {
    medName: { type: String, required: true },
    type: { type: String, required: true },
    color: { type: String, required: false },
    sideEffect: { type: String, required: false },
    medLimitation : { type: String, required: false }
  },
  {
    timestamps: true,
    //toJSON : { virtuals : true}
  }
);

module.exports = mongoose.model("pharmacy", Pharmacy);
