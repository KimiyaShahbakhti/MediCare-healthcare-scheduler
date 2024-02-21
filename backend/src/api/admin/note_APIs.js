const express = require("express");
const app = express();
const func = require("./../../dbFunctions");

app.post("/postAddMedicalnoteForm", async (req, res) => {
  const new_medicalnote = func.new_medicalnote;
  const { problem, text } = req.body;

  await new_medicalnote({
    problem: problem,
    text: text,
  }).save();
});

app.post("/editMedicalNote/:id", async (req, res) => {
  const findOneAndUpdate_note = func.findOneAndUpdate_note;
  const noteID = req.params.id;

  const { text } = req.body;

  await findOneAndUpdate_note(
    { _id: noteID },
    {
      $set: {
        text: text,
      },
    }
  );
});

app.post("/postRemoveNoteForm/:id", async (req, res) => {
  const delete_note = func.delete_note;

  try {
    let query = { _id: req.params.id };
    await delete_note(query);
    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error" });
  }
});

app.get("/showNotes", async (req, res) => {
  const find_note = func.find_note;
  try {
    let medsData = await find_note();
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
