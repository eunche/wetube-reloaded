import express from "express";
import {
  blockLoggedInUserMiddleware,
  blockAnonymousUserMiddleware,
  blockGithubLoginUserMiddleware,
  avatarUploadMiddleware,
} from "../middlewares";
import {
  profile,
  logout,
  getEdit,
  postEdit,
  getChangePassword,
  postChangePassword,
  startGithubLogin,
  githubLoginCallback,
} from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/logout", blockAnonymousUserMiddleware, logout);
userRouter
  .route("/edit")
  .all(blockAnonymousUserMiddleware)
  .get(getEdit)
  .post(avatarUploadMiddleware.single("avatar"), postEdit);
userRouter
  .route("/change-password")
  .all(blockAnonymousUserMiddleware, blockGithubLoginUserMiddleware)
  .get(getChangePassword)
  .post(postChangePassword);
userRouter.get("/github/start", blockLoggedInUserMiddleware, startGithubLogin);
userRouter.get(
  "/github/callback",
  blockLoggedInUserMiddleware,
  githubLoginCallback
);
userRouter.get("/:id", profile);

export default userRouter;
