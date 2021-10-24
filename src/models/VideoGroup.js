import mongoose from "mongoose";

const videoGroupSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, maxLength: 80 },
    videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
    createdAt: { type: Date, default: Date.now, required: true },
    thumbURL: { type: String },
    followUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const VideoGroup = mongoose.model("VideoGroup", videoGroupSchema);

export default VideoGroup;