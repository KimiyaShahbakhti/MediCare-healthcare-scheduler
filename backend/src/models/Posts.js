const mongoose = require("mongoose");

const Post = mongoose.Schema(
  {
    title: { type: String, required: true },
    problem : { type: String, required: true },
    text: { type: String, required: true },
    likeCount : { type : Number , default : 0 },
    dislikeCount : { type : Number , default : 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
    dislikedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
  },
  {
    timestamps: true,
    //toJSON : { virtuals : true}
  }
); 

module.exports = mongoose.model("post", Post);
