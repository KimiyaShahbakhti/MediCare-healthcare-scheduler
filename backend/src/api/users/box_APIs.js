const express = require("express");
const app = express();
const func = require("./../../dbFunctions");
const mongoose = require("mongoose");

app.post("/postAddBoxFormPersonal", async (req, res) => {
  const { user, boxName, desc, medicines, notes } = req.body;
  let titleOfBox;
  let newBoxID;
  let newnoteID;
  let medicalNotes = [];
  let manualNotes = [];

  function slug(title) {
    return title.replace(/([^۰-۹آ-یa-z0-9]|-)+/g, "-");
  }

  const findOne_problem = func.findOne_problem;
  if (mongoose.Types.ObjectId.isValid(boxName)) {
    let problemFetch = await findOne_problem({ _id: boxName });
    titleOfBox = problemFetch.problem;
  } else {
    titleOfBox = boxName;
  }

  const new_note_personal = func.new_note_personal;
  for (const note of notes) {
    if (mongoose.Types.ObjectId.isValid(note)) {
      medicalNotes.push(note);
    } else {
      await new_note_personal({
        user: user,
        problem: titleOfBox,
        note: note,
      })
        .save()
        .then((savedDocument) => {
          newnoteID = savedDocument._id.toHexString();
        });
      manualNotes.push(newnoteID);
    }
  }

  const new_box_personal = func.new_box_personal;
  await new_box_personal({
    user: user,
    boxName: titleOfBox,
    desc: desc,
    slug: slug(titleOfBox),
    medicines: medicines,
    medicalnotes: medicalNotes,
    manualnotes: manualNotes,
  })
    .save()
    .then((savedDocument) => {
      newBoxID = savedDocument._id.toHexString();
    });

  const findOneAndUpdate_note_personal = func.findOneAndUpdate_note_personal;
  await findOneAndUpdate_note_personal(
    { _id: newnoteID },
    {
      $set: {
        box: newBoxID,
      },
    }
  );
});

app.post("/editBoxPersonal/:id", async (req, res) => {
  let newnoteID = [];
  const boxID = req.params.id;
  const { user, boxName, desc, medicines, notes } = req.body;
console.log(req.body);
  const new_note_personal = func.new_note_personal;
  if (notes != "") {
    await new_note_personal({
      user: user,
      problem: boxName,
      note: notes,
    })
      .save()
      .then((savedDocument) => {
        newnoteID.push(savedDocument._id.toHexString());
      });
  }

  const findOneAndUpdate_box_personal = func.findOneAndUpdate_box_personal;

  await findOneAndUpdate_box_personal(
    { _id: boxID },
    {
      $push: {
        medicines: medicines,
        manualnotes: newnoteID,
      },
      $set: {
        desc: desc, 
      },
    }
  );
});

app.post("/postRemoveBoxPresonalForm/:id", async (req, res) => {
  const delete_box_personal = func.delete_box_personal;
  const delete_note_personal = func.delete_note_personal;
  const findOne_box = func.findOne_box;
  try {
    let query = { _id: req.params.id };
    let boxFetch = await findOne_box(query);
    for (const manualnote of boxFetch[0].manualnotes) {
      let extractedId = String(manualnote._id);
      await delete_note_personal({ _id: extractedId });
    }
    await delete_box_personal(query);
    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error" });
  }
});

app.get("/showBoxes/:id", async (req, res) => {
  const find_box_personal = func.find_box_personal;
  try {
    let boxesData = await find_box_personal({ user: req.params.id })
      .populate("medicines")
      .populate("medicalnotes")
      .populate("manualnotes")
      .exec();
    return res.status(200).json({
      success: true,
      count: boxesData.length,
      data: boxesData,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error" });
  }
});

app.post("/postRemoveNoteFromboxPresonal/:id", async (req, res) => {
  const findOneAndUpdate_box_personal = func.findOneAndUpdate_box_personal;
  const findOne_box = func.findOne_box;
  try {
    let query = { _id: req.params.id.split("-")[1] };
    let boxFetch = await findOne_box(query);

    for (const note of boxFetch[0].manualnotes) {
      let extractedId = String(note._id);
      if (extractedId == req.params.id.split("-")[0]) {
        await findOneAndUpdate_box_personal(
          { _id: req.params.id.split("-")[1] },
          { $pull: { manualnotes: extractedId } }
        );
      }
    }
    for (const note of boxFetch[0].medicalnotes) {
      let extractedId = String(note._id);
      if (extractedId == req.params.id.split("-")[0]) {
        await findOneAndUpdate_box_personal(
          { _id: req.params.id.split("-")[1] },
          { $pull: { medicalnotes: extractedId } }
        );
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error" });
  }
});

app.post("/postRemoveMedicineFromboxPresonal/:id", async (req, res) => {
  const findOneAndUpdate_box_personal = func.findOneAndUpdate_box_personal;
  const findOne_box = func.findOne_box;
  try {
    let query = { _id: req.params.id.split("-")[1] };
    let boxFetch = await findOne_box(query);
    for (const medicine of boxFetch[0].medicines) {
      let extractedId = String(medicine._id);
      if (extractedId == req.params.id.split("-")[0]) {
        await findOneAndUpdate_box_personal(
          { _id: req.params.id.split("-")[1] },
          { $pull: { medicines: extractedId } }
        );
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error" });
  }
});

app.post("/postRemoveMedicineFromboxAftermedPresonal/:id", async (req, res) => {
  const findOneAndUpdate_box_personal = func.findOneAndUpdate_box_personal;
  const find_box_personal = func.find_box_personal;
  try {
    let allBoxes = await find_box_personal({
      user: req.params.id.split("-")[1],
    });
    if (allBoxes) {
      for (const box of allBoxes) {
        if (box.medicines.includes(req.params.id.split("-")[0])) {
          await findOneAndUpdate_box_personal(
            { _id: box._id },
            { $pull: { medicines: req.params.id.split("-")[0] } }
          );
        }
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error" });
  }
});

module.exports = app;
