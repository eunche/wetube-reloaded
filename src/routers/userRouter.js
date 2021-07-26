import express from "express";
import {
    blockLoggedInUserMiddleware,
    blockAnonymousUserMiddleware,
    uploadFileMiddleware,
} from "../middlewares";
import {
    see,
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
userRouter.route("/edit").all(blockAnonymousUserMiddleware).get(getEdit).post(uploadFileMiddleware.single("avatar"), postEdit);
userRouter.route("/change-password").all(blockAnonymousUserMiddleware).get(getChangePassword).post(postChangePassword);
userRouter.get("/github/start", blockLoggedInUserMiddleware, startGithubLogin);
userRouter.get("/github/callback", blockLoggedInUserMiddleware, githubLoginCallback);
userRouter.get("/:id(\\d+)", see);


export default userRouter;