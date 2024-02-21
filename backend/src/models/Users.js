const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Users = mongoose.Schema(
  {
    admin: { type: Boolean, default: false },
    fullname: { type: String, required: true },
    email: { type: String, required: true },
    tell: { type: Number, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    image: { type: String },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

//password hash after signup
Users.pre("save", function (next) {
  const salt = bcrypt.genSaltSync(15);
  const hash = bcrypt.hashSync(this.password, salt);
  this.password = hash;
  next();
});
Users.pre("findOneAndUpdate", function (next) {
  if (!this._update.$set.password) {
    return next();
  }
  const salt = bcrypt.genSaltSync(15);
  const hash = bcrypt.hashSync(this.getUpdate().$set.password, salt);
  this.getUpdate().$set.password = hash;
  next();
});
Users.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

Users.virtual("medicines", {
  ref: "Medicines",
  localField: "_id",
  foreignField: "user",
});

module.exports = mongoose.model("users", Users);
