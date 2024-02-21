const express = require("express");
const app = express();
const func = require("./../../dbFunctions");

app.get("/showNoteWithSpecificProblem/:id", async (req, res) => {

  const findOne_problem = func.findOne_problem;
  const find_note = func.find_note;
  try {    
    let problemName = await findOne_problem({_id:req.params.id})
    let notesData = await find_note({problem:problemName.problem})
    return res.status(200).json({
      success: true,
      count: notesData.length,
      data: notesData,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error" });
  }
});

module.exports = app;


