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
            followerCount: 1,
        }

        if (thumb) {
            videoGroupObject.thumbURL = isHeroku ? thumb.location : thumb.path;
        }
        
        const newVideoGroup = await VideoGroup.create(videoGroupObject);
        const loggedInUser = await User.findById(loggedInUserId);

        newVideoGroup.follower.push(loggedInUser);
        newVideoGroup.save();
        loggedInUser.videoGroups.push(newVideoGroup);
        loggedInUser.save();
        req.session.user = loggedInUser;


        return res.redirect(`/groups/${newVideoGroup.name}`)
    } catch (error) {
        console.log(error);
        return res.status(400).render("videoGroups/create", {
          pageTitle: "Create Group",
          errorMessage: error._message,
        });
      }
}

export const getSearch = async (req, res) => {
    const { group_keyword: keyword } = req.query;
    let groups = [];
    if (keyword) {
        groups = await VideoGroup.find({
          name: {
            $regex: keyword,
            $options: "i",
          },
        });
      }
    return res.render("videoGroups/search", { pageTitle: "Group Search", groups });
}

export const getDetail = async (req, res) => {
  const { groupName } = req.params;
  const group = await VideoGroup.findOne({name: groupName }).populate({
    path: "videos",
    populate: {
      path: "owner",
    },
  });

  return res.render("videoGroups/detail", { pageTitle: `${groupName} 그룹`, group });
}

export const postFollow = async (req, res) => {
  const { groupId } = req.body;
  const { _id:userId } = req.session.user;

  const user = await User.findById(userId);

  console.log(user);
  user.videoGroups.push({ _id: groupId });
  user.save();
  req.session.user = user;

  const group = await VideoGroup.findById(groupId);
  group.follower.push({ _id: user._id });
  group.followerCount += 1;
  group.save();

  return res.sendStatus(200);
}

export const deleteFollow = async (req, res) => {
  const { groupId } = req.body;
  const { _id:userId } = req.session.user;

  const user = await User.findById(userId);

  console.log(user);
  user.videoGroups.pull(groupId);
  user.save();
  req.session.user = user;

  const group = await VideoGroup.findById(groupId);
  group.follower.pull(user._id);
  group.followerCount -= 1;
  group.save();

  return res.sendStatus(200);
}