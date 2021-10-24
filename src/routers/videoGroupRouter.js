import express from "express";
import { blockAnonymousUserMiddleware, ffmpegAuthMiddleware, GroupImageUploadMiddleware } from "../middlewares"
import { getCreate, postCreate } from "../controllers/videoGroupController"

const videoGroupRouter = express.Router();

videoGroupRouter
    .route("/create")
    .all(ffmpegAuthMiddleware, blockAnonymousUserMiddleware)
    .get(getCreate)
    .post(
        GroupImageUploadMiddleware.single("thumb"),
        postCreate
    );

export default videoGroupRouter;
