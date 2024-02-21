const express = require("express");
const app = express();
const func = require("./../../dbFunctions");

app.post("/postAddPostForm", async (req, res) => {
  const new_post = func.new_post;

  console.log(req.body, "in addmed");
  const { title, text, problem } = req.body;

  await new_post({
    title: title,
    text: text,
    problem: problem,
  }).save();
});

app.post("/editPost/:id", async (req, res) => {
  const postID = req.params.id;
  const { title, problem, text } = req.body;

  const findOneAndUpdate_post = func.findOneAndUpdate_post;

  await findOneAndUpdate_post(
    { _id: postID },
    {
      $set: {
        ftitle: title,
        problem: problem,
        text: text,
      },
    }
  );
});

app.post("/postRemovePostForm/:id", async (req, res) => {
  const delete_post = func.delete_post;

  try {
    let query = { _id: req.params.id };
    await delete_post(query);
    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error" });
  }
});

app.get("/showPosts", async (req, res) => {
  const find_post = func.find_post;

  try {
    let postsData = await find_post();
    return res.status(200).json({
      success: true,
      count: postsData.length,
      data: postsData,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error" });
  }
});

module.exports = app;
