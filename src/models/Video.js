import mongoose from "mongoose";


const videoSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true, maxLength: 80 },
    description: { type: String, required: true, trim: true, minLength: 10 },
    createdAt: { type: Date, default: Date.now, required: true },
    hashtags: [{ type: String, trim: true }],
    meta: {
        views: { type: Number, default: 0, required: true },
        rating: { type: Number, default: 0, required: true },
    },
});

videoSchema.static('formatHashtags', function (hashtags) {
    return hashtags = hashtags
        .split(",")
        .map(word => (word.startsWith("#") ? word : `#${word}`));
})

const Video = mongoose.model("Video", videoSchema);


export default Video;