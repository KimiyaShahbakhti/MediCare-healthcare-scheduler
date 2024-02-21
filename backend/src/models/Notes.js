const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const uniqueString = require("unique-string");
const Schema = mongoose.Schema;

const Notes = mongoose.Schema(
  {
    user : { type : Schema.Types.ObjectId , ref : 'Users'},
    box : { type : Schema.Types.ObjectId , ref : 'Box'},
    problem: { type: String, required: true },
    note: { type: String, required: true },
  },
  {
    timestamps: true,
    //toJSON : { virtuals : true}
  }
);


module.exports = mongoose.model("Notes", Notes);
