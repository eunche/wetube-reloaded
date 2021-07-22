import express from "express";
import {
    blockLoggedInUserMiddleware,
    blockAnonymousUserMiddleware,
} from "../middlewares";
import {
    see,
    logout,
    getEdit,
    postEdit,
    startGithubLogin,
    githubLoginCallback,
} from "../controllers/userController";


const userRouter = express.Router();


userRouter.get("/logout", blockAnonymousUserMiddleware, logout);
userRouter.route("/edit").all(blockAnonymousUserMiddleware).get(getEdit).post(postEdit);
userRouter.get("/github/start", blockLoggedInUserMiddleware, startGithubLogin);
userRouter.get("/github/callback", blockLoggedInUserMiddleware, githubLoginCallback);
userRouter.get("/:id(\\d+)", see);


export default userRouter;