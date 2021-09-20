import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxLength: 80 },
  description: { type: String, required: true, trim: true, maxLength: 80 },
  createdAt: { type: Date, default: Date.now, required: true },
  hashtags: [{ type: String, trim: true }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
  },
  fileURL: { type: String, required: true },
  thumbURL: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
});

videoSchema.static("formatHashtags", function (hashtags) {
  return (hashtags = hashtags
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`)));
});

const Video = mongoose.model("Video", videoSchema);

export default Video;
