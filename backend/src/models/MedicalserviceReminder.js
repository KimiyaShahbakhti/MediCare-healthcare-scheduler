const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Reminderservice = mongoose.Schema(
  {
    user : { type : Schema.Types.ObjectId , ref : 'Users'},
    serivce: { type: String, required: true },
    desc: { type: String, required: false, default:"ندارد" },
    reminderTime: { type: Date, required: true },
    mintonotif:{ type: Number, required: false , default:0 },
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model("Reminderservice", Reminderservice);
