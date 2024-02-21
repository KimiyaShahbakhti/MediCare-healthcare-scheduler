const express = require("express");
const app = express();
const func = require("./../dbFunctions");
const fs = require("fs");
const upload = require("../uploadImages");

app.post(
  "/postProfilefrom",
  upload.single("uploadedimage"),
  async (req, res) => {
    let imageName;
    if (req.file) {
      imageName = req.file.filename;
    }

    const findOneAndUpdate_member = func.findOneAndUpdate_member;
    const { _id, fullname, email, tell, username, password } = req.body;

    //remove previous image after edit profile
    const previousImage = (await func.findOne_member({ _id: _id })).image;
    if (previousImage && imageName != undefined) {
      const filePath = "../frontend/src/assets/uploads/images/" + previousImage;
      fs.unlinkSync(filePath);
    }

    if (password == " ") {
      await findOneAndUpdate_member(
        { _id: _id },
        {
          $set: {
            fullname: fullname,
            email: email,
            tell: tell,
            username: username,
            image: imageName,
          },
        }
      );
    } else {
      await findOneAndUpdate_member(
        { _id: _id },
        {
          $set: {
            fullname: fullname,
            email: email,
            tell: tell,
            username: username,
            password: password,
            image: imagePath,
          },
        }
      );
    }
  }
);

app.post("/postLikeEdit/:info", async (req, res) => {
  const postID = req.params.info.split("-")[0];
  const plusORmin = req.params.info.split("-")[1];
  const likeOrdislike = req.params.info.split("-")[2];
  const byUserID = req.params.info.split("-")[3];

  const findOneAndUpdate_post = func.findOneAndUpdate_post;
  const findOne_post = func.findOne_post;

  const post = await findOne_post({ _id: postID });

  if (likeOrdislike == "like") {
    switch (plusORmin) {
      case "true":
        if (post.dislikedBy.includes(byUserID)) {
          await findOneAndUpdate_post(
            { _id: postID },
            {
              $inc: {
                likeCount: +1,
                dislikeCount: -1,
              },
              $addToSet: {
                likedBy: byUserID,
              },
              $pull: { dislikedBy: byUserID },
            }
          );
        } else {
          await findOneAndUpdate_post(
            { _id: postID },
            {
              $inc: { likeCount: +1 },
              $addToSet: {
                likedBy: byUserID,
              },
              $pull: { dislikedBy: byUserID },
            }
          );
        }

        break;
      case "false":
        await findOneAndUpdate_post(
          { _id: postID },
          {
            $inc: { likeCount: -1 },
            $pull: { likedBy: byUserID },
          }
        );
        break;
    }
  }
  if (likeOrdislike == "dislike") {
    switch (plusORmin) {
      case "true":
        if (post.likedBy.includes(byUserID)) {
          await findOneAndUpdate_post(
            { _id: postID },
            {
              $inc: {
                dislikeCount: +1,
                likeCount: -1,
              },
              $addToSet: {
                dislikedBy: byUserID,
              },
              $pull: { likedBy: byUserID },
            }
          );
        } else {
          await findOneAndUpdate_post(
            { _id: postID },
            {
              $inc: { dislikeCount: +1 },
              $addToSet: {
                dislikedBy: byUserID,
              },
              $pull: { likedBy: byUserID },
            }
          );
        }
        break;
      case "false":
        await findOneAndUpdate_post(
          { _id: postID },
          {
            $inc: { dislikeCount: -1 },
            $pull: { dislikedBy: byUserID },
          }
        );
        break;
    }
  }
});

app.get("/profileInfo/:id", async (req, res) => {
  const find_member = func.find_member;

  try {
    let query = { _id: req.params.id };
    let profileData = await find_member(query);
    return res.status(200).json({
      success: true,
      count: profileData.length,
      data: profileData,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error" });
  }
});

app.post("/resetPassword", async (req, res) => {
  console.log(req.body);
  const findOneAndUpdate_member = func.findOneAndUpdate_member;
  const { username, password } = req.body;

  await findOneAndUpdate_member(
    { username: username },
    {
      $set: {
        password: password,
      },
    }
  );
});

app.get("/showProblems", async (req, res) => {
  const find_problem = func.find_problem;
  try {
    let problemsData = await find_problem();
    return res.status(200).json({
      success: true,
      count: problemsData.length,
      data: problemsData,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error" });
  }
});

app.get("/showSelectedProblem/:id", async (req, res) => {
  const findOne_problem = func.findOne_problem;

  try {
    let problemInfo = await findOne_problem({ problem: req.params.id });
    return res.status(200).json({
      success: true,
      count: problemInfo.length,
      data: problemInfo,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error" });
  }
});

app.get("/showMedicalServices", async (req, res) => {
  const find_medical_services = func.find_medical_services;

  try {
    let medicalservices = await find_medical_services();
    return res.status(200).json({
      success: true,
      count: medicalservices.length,
      data: medicalservices,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error" });
  }
});

module.exports = app;
