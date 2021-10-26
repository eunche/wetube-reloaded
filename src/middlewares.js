import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";
import User from "./models/User";
import VideoGroup from "./models/VideoGroup";

const s3 = new aws.S3({
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

const isHeroku = process.env.NODE_ENV === "production";

const s3ImageUploader = multerS3({
  s3: s3,
  bucket: "youtube-clone-eunchae/images",
  acl: "public-read",
});

const s3VideoUploader = multerS3({
  s3: s3,
  bucket: "youtube-clone-eunchae/videos",
  acl: "public-read",
});

export const localMiddleware = async (req, res, next) => {
  if (req.session.loggedIn) {
    res.locals.loggedIn = true;
    res.locals.user = await User.findById(req.session.user._id).populate("videoGroups");
  }
  res.locals.siteName = "비디오 그룹";
  res.locals.isHeroku = isHeroku;

  const todaysGroups = await VideoGroup.aggregate([
    { $sample: { size: 3 } },
  ]);
  res.locals.todaysGroups = todaysGroups;
  next();
};

export const blockLoggedInUserMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    req.flash("error", "Not authorized");
    res.redirect("/");
  } else {
    next();
  }
};

export const blockAnonymousUserMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    req.flash("error", "Login is required.");
    res.redirect("/login");
  } else {
    next();
  }
};

export const blockGithubLoginUserMiddleware = (req, res, next) => {
  if (req.session.user.isGithubLogin) {
    req.flash("error", "Not authorized");
    return res.redirect("/");
  } else {
    next();
  }
};

export const blockNotGroupUserMiddleware = async (req, res, next) => {
  const { user } = req.session;
  let videoGroup;
  try{
    videoGroup = await VideoGroup.findOne({ name: req.params.groupName });
    if(!videoGroup){
      throw new Error();
    }
  } catch{
    return res.render("404", {pageTitle:"Group Not Found"});
  }

  try{
    const isInGroup = user.videoGroups.find(e => String(e._id) === String(videoGroup._id));
    if(!isInGroup){
      throw new Error();
    }
    next();
  }catch{
    req.flash("error", "Please Join The Group.");
    return res.redirect("/");
  }
  
}

export const avatarUploadMiddleware = multer({
  dest: "uploads/users/avatars/",
  limits: {
    fileSize: 3000000,
  },
  storage: isHeroku ? s3ImageUploader : undefined,
});

export const videoUploadMiddleware = multer({
  dest: "uploads/videos/",
  limits: {
    fileSize: 15000000,
  },
  storage: isHeroku ? s3VideoUploader : undefined,
});

export const GroupImageUploadMiddleware = multer({
  dest: "uploads/group_image/",
  limits: {
    fileSize: 15000000,
  },
  storage: isHeroku ? s3VideoUploader : undefined,
});

export const ffmpegAuthMiddleware = (_, res, next) => {
  res.header("Cross-Origin-Embedder-Policy", "require-corp");
  res.header("Cross-Origin-Opener-Policy", "same-origin");
  next();
};
