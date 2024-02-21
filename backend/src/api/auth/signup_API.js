const express = require("express");
const app = express();
const func = require("../../dbFunctions");

module.exports = app.post("/postRegfrom", async (req, res) => {
  const new_member = func.new_member;
  const findOne_member = func.findOne_member;

  const { fullname, email, tell, username, password1 } = req.body;

  await findOne_member({ username: username }).then(function (user, err) {
    if (err) {
      return res.send(err);
    }
    if (user) {
      return res.status(403).send({ message: "usernameAlreadyTaken" });
    } 
    else {
      new_member({
        admin: false,
        fullname: fullname,
        email: email,
        tell: tell,
        username: username,
        password: password1,
      }).save();
      return res.status(200).send({ message: "registered" });
    }
  });
});


