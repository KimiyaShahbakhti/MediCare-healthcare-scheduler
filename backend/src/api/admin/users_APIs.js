const express = require("express");
const app = express();
const func = require("./../../dbFunctions");

app.get("/showUsers", async (req, res) => {
  const find_member = func.find_member;

  try {
    let query = { admin: false };
    let usersData = await find_member(query);
    return res.status(200).json({
      success: true,
      count: usersData.length,
      data: usersData,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error" });
  }
});

module.exports = app;
