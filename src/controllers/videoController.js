import Video from "../models/Video";
import VideoGroup from "../models/VideoGroup";
import User from "../models/User";
import Comment from "../models/Comment";

export const home = async (req, res) => {
  const popularGroups = await VideoGroup.find({}).sort({followerCount: -1}).limit(4);
  const videos = await Video.find({})
    .populate("owner")
    .populate("videoGroup")
    .sort({ createdAt: "desc" });
  return res.render("home", { pageTitle: "Home", videos, popularGroups });
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id)
                  .populate("owner")
                  .populate({
                    path: "comments",
                    populate: {
                      path: "owner",
                    }
                  })
                  .populate("videoGroup");
  console.log(video);
  if (!video) {
    return res.render("404", { pageTitle: "Video not found." });
  }
  return res.render("videos/watch", { pageTitle: video.title, video });
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id: userId },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(userId)) {
    req.flash("error", "Not authorized");
    return res.status(403).redirect("/");
  }
  return res.render("videos/edit", { pageTitle: `Edit ${video.title}`, video });
};

export const postEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id: userId },
  } = req.session;
  const { title, description, hashtags } = req.body;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(userId)) {
    req.flash("error", "You are not the the owner of the video.");
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  req.flash("success", "Changes Saved.");
  return res.redirect(`/videos/${id}`);
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndDelete(id);
  return res.redirect("/");
};

export const getUpload = (req, res) => {
  return res.render("videos/upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
  const { _id: owner } = req.session.user;
  const { video, thumb } = req.files;
  const { groupName } = req.params;
  const { title, description, hashtags } = req.body;

  const videoGroup = await VideoGroup.findOne({ name: groupName });

  const isHeroku = process.env.NODE_ENV === "production";

  try {
    const videoObject = {
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
      meta: {
        views: 0,
        rating: 0,
      },
      fileURL: isHeroku ? video[0].location : video[0].path,
      owner,
      videoGroup,
    };
    if (thumb) {
      videoObject.thumbURL = isHeroku ? thumb[0].location : thumb[0].path;
    }

    
    const newVideo = await Video.create(videoObject);

    videoGroup.videos.push(newVideo);
    videoGroup.save();
    
    const ownerObject = await User.findById(owner);
    ownerObject.videos.push(newVideo);
    ownerObject.save();

    req.session.user = ownerObject;
    
    return res.redirect("/");
  } catch (error) {
    return res.status(400).render("videos/upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

export const search = async (req, res) => {
  const { video_keyword:keyword } = req.query;
  const { groupName } = req.params;
  const group = await VideoGroup.findOne({name: groupName});
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: keyword,
        $options: "i",
      },
      videoGroup: group
    });
  }
  return res.render("videos/search", { pageTitle: "Search", videos, group });
};

export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  } else {
    video.meta.views += 1;
    await video.save();
    return res.sendStatus(200);
  }
};

export const createComment = async (req, res) => {
  const {
    session: { user },
    body: { text },
    params: { id },
  } = req;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  const comment = await Comment.create({
    text,
    owner: user._id,
    video: id,
  });
  video.comments.push(comment._id);
  video.save();
  return res.status(201).json(comment);
};

export const deleteComment = async (req, res) => {
  const {
    session: { user: loggedInUser },
    body: { commentId },
  } = req;
  const comment = await Comment.findById(commentId);

  // if ?????? ????????? !== ???????????? ?????? -> 404 ??????
  if (String(comment.owner) !== String(loggedInUser._id)) {
    return res.sendStatus(404);
  }

  await Comment.deleteOne({ _id: commentId });
  return res.sendStatus(200);
};
