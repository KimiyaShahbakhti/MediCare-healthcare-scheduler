const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const uniqueString = require("unique-string");
const Schema = mongoose.Schema;

const Box = mongoose.Schema(
  {
    user : { type : Schema.Types.ObjectId , ref : 'Users'},
    boxName: { type: String, required: true },
    desc: { type: String, required: false },
    slug : { type : String, default : ''},
    medicines: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Medicines' }],
    medicalnotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Medicalnotes' }],
    manualnotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notes' }]
  },
  {
    timestamps: true,
    toJSON : { virtuals : true}
  }
);


module.exports = mongoose.model("box", Box);
