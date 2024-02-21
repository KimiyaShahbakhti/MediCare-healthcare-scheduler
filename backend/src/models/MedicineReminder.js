const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Remindermed = mongoose.Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "Users" },
    medicine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medicines",
      required: true,
    },
    dose: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    schedualeType:{type: String , required: true },
    reminderTimes: [{ type: Date, required: true }],
    startTime: { type: String, required: false },
    repeatDate: {type: String,required: false,}, 
    specificHour: { type: String, required: false },
    repeatHours: { type: String,  required: false  },
    mintonotif:{ type: Number, required: false , default:0},
  },
  {
    timestamps: true,
    //toJSON : { virtuals : true}
  }
);

module.exports = mongoose.model("Remindermed", Remindermed);
