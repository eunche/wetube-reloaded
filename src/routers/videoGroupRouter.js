import express from "express";
import { blockAnonymousUserMiddleware, ffmpegAuthMiddleware, GroupImageUploadMiddleware } from "../middlewares"
import { getCreate, postCreate, getSearch } from "../controllers/videoGroupController"

const videoGroupRouter = express.Router();

videoGroupRouter
    .route("/create")
    .all(ffmpegAuthMiddleware, blockAnonymousUserMiddleware)
    .get(getCreate)
    .post(
        GroupImageUploadMiddleware.single("thumb"),
        postCreate
    );
videoGroupRouter.route("/search").get(getSearch);

export default videoGroupRouter;
