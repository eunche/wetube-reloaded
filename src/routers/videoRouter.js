import express from "express";
import {
    blockLoggedInUserMiddleware,
    blockAnonymousUserMiddleware,
} from "../middlewares";
import { watch, getEdit, postEdit, deleteVideo, getUpload, postUpload } from "../controllers/videoController";


const videoRouter = express.Router();


videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter.route("/:id([0-9a-f]{24})/edit").all(blockAnonymousUserMiddleware).get(getEdit).post(postEdit);
videoRouter.get("/:id([0-9a-f]{24})/delete", blockAnonymousUserMiddleware, deleteVideo);
videoRouter.route("/upload").all(blockAnonymousUserMiddleware).get(getUpload).post(postUpload);


export default videoRouter;