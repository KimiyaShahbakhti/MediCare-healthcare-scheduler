const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Reminderappo = mongoose.Schema(
  {
    user : { type : Schema.Types.ObjectId , ref : 'Users'},
    doctorName: { type: String, required: true },
    requirements: { type: String, required: false },
    reason: { type: String, required: false },
    reminderTime: { type: Date, required: true },
    mintonotif:{ type: Number, required: false, default:0 },
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model("Reminderappo", Reminderappo);
