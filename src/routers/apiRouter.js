import express from "express";
import {
  registerView,
  createComment,
  deleteComment,
} from "../controllers/videoController";
import { postFollow, deleteFollow } from "../controllers/videoGroupController";
import { blockAnonymousUserMiddleware } from "../middlewares";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView);
apiRouter
  .route("/videos/:id([0-9a-f]{24})/comment")
  .all(blockAnonymousUserMiddleware)
  .post(createComment)
  .delete(deleteComment);
apiRouter
  .route("/groups/:id([0-9a-f]{24})/follow")
  .all(blockAnonymousUserMiddleware)
  .post(postFollow)
  .delete(deleteFollow);
export default apiRouter;
