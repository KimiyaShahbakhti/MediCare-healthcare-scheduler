const express = require("express");
const app = express();
const func = require("./../../dbFunctions");

app.post("/postAddMedForm", async (req, res) => {
  const new_med = func.new_med;

  const { medName, type, color, sideEffect, medLimitation } = req.body;

  await new_med({
    medName: medName,
    type: type,
    color: color,
    sideEffect: sideEffect,
    medLimitation: medLimitation,
  }).save();
});

app.post("/editMedInPharmacy/:id", async (req, res) => {
  const medID = req.params.id;
  const { medName, type, color, sideEffect, medLimitation } = req.body;

  const findOneAndUpdate_med = func.findOneAndUpdate_med;

  await findOneAndUpdate_med(
    { _id: medID },
    {
      $set: {
        medName: medName,
        type: type,
        color: color,
        sideEffect: sideEffect,
        medLimitation: medLimitation,
      },
    }
  );
});

app.post("/postRemoveMedForm/:id", async (req, res) => {
  const delete_med = func.delete_med;

  try {
    let query = { _id: req.params.id };
    await delete_med(query);
    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error" });
  }
});

app.get("/showPharmacy", async (req, res) => {
  const find_med = func.find_med;
  try {
    let medsData = await find_med();
    return res.status(200).json({
      success: true,
      count: medsData.length,
      data: medsData,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error" });
  }
});

module.exports = app;
