import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

const s3 = new aws.S3({
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

const multerUploader = multerS3({
  s3: s3,
  bucket: "youtube-clone-eunchae",
  acl: "public-read",
});

export const localMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    res.locals.loggedIn = true;
    res.locals.user = req.session.user;
  }
  res.locals.siteName = "Wetube";
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

export const avatarUploadMiddleware = multer({
  dest: "uploads/users/avatars/",
  limits: {
    fileSize: 3000000,
  },
  storage: multerUploader,
});

export const videoUploadMiddleware = multer({
  dest: "uploads/videos/",
  limits: {
    fileSize: 15000000,
  },
  storage: multerUploader,
});

export const ffmpegAuthMiddleware = (_, res, next) => {
  res.header("Cross-Origin-Embedder-Policy", "require-corp");
  res.header("Cross-Origin-Opener-Policy", "same-origin");
  next();
};
