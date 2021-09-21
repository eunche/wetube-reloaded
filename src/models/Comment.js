import mongoose from "mongoose";
import Video from "./Video";

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true, maxLength: 80 },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  video: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Video" },
  createdAt: { type: Date, required: true, default: Date.now },
});

commentSchema.pre("deleteOne", async function () {
  console.log("deleteOne!!!");
  const { _id } = this.getFilter();
  const video = await Video.findOne({ comments: _id });
  await video.comments.pull(_id);
  await video.save();
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
