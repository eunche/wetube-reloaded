import VideoGroup from "../models/VideoGroup";
import User from "../models/User";

export const getCreate = (req, res) => {
    return res.render("videoGroups/create", { pageTitle: "Group Create" });
}

export const postCreate = async (req, res) => {
    const { _id: loggedInUserId } = req.session.user;
    const thumb = req.file;
    const { name } = req.body;

    const isHeroku = process.env.NODE_ENV === "production";

    try{
        const videoGroupObject = {
            name,
            thumbURL: isHeroku ? thumb.location : thumb.path, 
        }
        
        const newVideoGroup = await VideoGroup.create(videoGroupObject);
        const loggedInUser = await User.findById(loggedInUserId);

        newVideoGroup.follower.push(loggedInUser);
        newVideoGroup.save();
        loggedInUser.videoGroups.push(newVideoGroup);
        loggedInUser.save();

        return res.redirect(`/videos/group/${newVideoGroup.name}`)
    } catch (error) {
        console.log(error);
        return res.status(400).render("videoGroups/create", {
          pageTitle: "Create Group",
          errorMessage: error._message,
        });
      }
}