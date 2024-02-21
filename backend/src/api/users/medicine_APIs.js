const express = require("express");
const app = express();
const func = require("./../../dbFunctions");

// Medicine
app.get("/showMedicines/:id", async (req, res) => {
  const find_med_personal = func.find_med_personal;
  try {
    let medsData = await find_med_personal({ _id: req.params.id })
      .populate("medicines")
      .exec();
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

app.get("/showSelectedMedicine/:id", async (req, res) => {
  const findOne_med = func.findOne_med;

  try {
    let medInfo = await findOne_med({ _id: req.params.id });
    return res.status(200).json({
      success: true,
      count: medInfo.length,
      data: medInfo,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error" });
  }
});

app.post("/postAddMedFormPersonal", async (req, res) => {
  const new_med_personal = func.new_med_personal;
  const { user, medName, type, color, sideEffect, medLimitation } =
    req.body;

  await new_med_personal({
    user: user,
    medName: medName,
    type: type,
    color: color,
    sideEffect: sideEffect,
    medLimitation: medLimitation,
  }).save();
});

app.post("/editMedInPharmacyPersonal/:id", async (req, res) => {
  const medID = req.params.id;
  const {  type, color, sideEffect, medLimitation } = req.body;
  const findOneAndUpdate_med_personal = func.findOneAndUpdate_med_personal;


  await findOneAndUpdate_med_personal(
    { _id: medID },
    {
      $set: {
        type: type,
        color: color,
        sideEffect: sideEffect,
        medLimitation: medLimitation,
      },
    }
  );
});

app.post("/postRemoveMedPresonalForm/:id", async (req, res) => {
  const delete_med_personal = func.delete_med_personal;

  try {
    let query = { _id: req.params.id };
    await delete_med_personal(query);
    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error" });
  }
});


module.exports = app;
