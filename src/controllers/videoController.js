import Video from "../models/Video";
import User from "../models/User";


export const home = async (req, res) => {
    const videos = await Video.find({}).sort({ createdAt: "desc" });
    return res.render("home", { pageTitle: "Home", videos });
}

export const watch = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id).populate("owner");
    if (!video) {
        return res.render("404", { pageTitle: "Video not found." })
    }
    return res.render("videos/watch", { pageTitle: video.title, video });
}

export const getEdit = async (req, res) => {
    const { id } = req.params;
    const { user: { _id: userId } } = req.session;
    const video = await Video.findById(id);
    if (!video) {
        return res.status(404).render("404", { pageTitle: "Video not found." })
    }
    if(String(video.owner) !== String(userId)){
        return res.status(403).redirect("/");
    }
    return res.render("videos/edit", { pageTitle: `Edit ${video.title}`, video });
}

export const postEdit = async (req, res) => {
    const { id } = req.params;
    const { user: { _id: userId } } = req.session;
    const { title, description, hashtags } = req.body;
    const video = await Video.findById(id);
    if (!video) {
        return res.status(404).render("404", { pageTitle: "Video not found." })
    }
    if(String(video.owner) !== String(userId)){
        return res.status(403).redirect("/");
    }
    await Video.findByIdAndUpdate(id, {
        title,
        description,
        hashtags: Video.formatHashtags(hashtags),
    })
    return res.redirect(`/videos/${id}`);
}

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
}

export const postUpload = async (req, res) => {
    const { _id: owner } = req.session.user;
    const { path: fileURL } = req.file;
    const { title, description, hashtags } = req.body;
    try {
        const newVideo = await Video.create({
            title,
            description,
            hashtags: Video.formatHashtags(hashtags),
            meta: {
                views: 0,
                rating: 0,
            },
            fileURL,
            owner,
        });
        const ownerObject = await User.findById(owner);
        ownerObject.videos.push(newVideo);
        ownerObject.save();
        return res.redirect("/");
    } catch (error) {
        console.log(error);
        return res.status(400).render("videos/upload", {
            pageTitle: "Upload Video",
            errorMessage: error._message,
        });
    }
}

export const search = async (req, res) => {
    const { keyword } = req.query;
    let videos = [];
    if (keyword) {
        videos = await Video.find({
            title: {
                $regex: new RegExp(`${keyword}$`, "i"),
            },
        });
    }
    return res.render("videos/search", { pageTitle: "Search", videos });
}