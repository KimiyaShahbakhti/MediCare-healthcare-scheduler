const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Medicines = mongoose.Schema(
  {
    user : { type : Schema.Types.ObjectId , ref : 'Users'},
    medName: { type: String, required: true },
    type: { type: String, required: true },
    color: { type: String, required: false },
    sideEffect: { type: String, required: false },
    medLimitation : { type: String, required: false }
  },
  {
    timestamps: true,
    toJSON : { virtuals : true}
  }
);


module.exports = mongoose.model("Medicines", Medicines);

// KimKim79!
// kimia7972@yahoo.com