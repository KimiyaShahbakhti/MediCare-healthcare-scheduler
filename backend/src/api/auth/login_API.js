const express = require("express");
const app = express();
const moment = require("moment");
var jwt = require("jsonwebtoken");
const func = require("../../dbFunctions");

module.exports = app.post("/postLogfrom", async (req, res) => {
  const findOne_member = func.findOne_member;
  const { username, password } = req.body;
  
  await findOne_member({ username: username }).then(function (user, err) {
    if (err) {
      return res.send(err);
    }
    if (!user) {
      return res.status(403).send({ message: "noUserFound" });
    } 
    if (user && !user.comparePassword(password)) {
      return res.status(403).send({ message: "WrongPass" });
    } 
    else {
      const payload = {
        iat: moment().unix(),
        userInfo: {
          _id: user._id,
          admin: user.admin,
        },
      };
      const token = jwt.sign(payload, config.consts.memberPtivateKey, {
        expiresIn: "365d",
      });
      //login is ok
      if (user.admin) {
        return res.status(200).send({
          message: "dataMatch-Admin",
          token: token,
        });
      } else {
        return res.status(200).send({
          message: "dataMatch-User",
          token: token,
        });
      }
    }
  });
});
