import express from "express";
import { see, logout, getEdit, postEdit, startGithubLogin, githubLoginCallback, } from "../controllers/userController";


const userRouter = express.Router();


userRouter.get("/logout", logout);
userRouter.route("/edit").get(getEdit).post(postEdit);
userRouter.get("/github/start", startGithubLogin);
userRouter.get("/github/callback", githubLoginCallback);
userRouter.get("/:id(\\d+)", see);


export default userRouter;