import express from "express";
import { blockAnonymousUserMiddleware, ffmpegAuthMiddleware, videoUploadMiddleware } from "../middlewares"
import { getCreate, postCreate } from "../controllers/videoGroupController"

const videoGroupRouter = express.Router();

videoGroupRouter
    .route("/create")
    .all(ffmpegAuthMiddleware, blockAnonymousUserMiddleware)
    .get(getCreate)
    .post(
        videoUploadMiddleware.single("thumb"),
        postCreate
    );

export default videoGroupRouter;
