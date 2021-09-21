import express from "express";
import {
  registerView,
  createComment,
  deleteComment,
} from "../controllers/videoController";
import { blockAnonymousUserMiddleware } from "../middlewares";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView);
apiRouter
  .route("/videos/:id([0-9a-f]{24})/comment")
  .all(blockAnonymousUserMiddleware)
  .post(createComment)
  .delete(deleteComment);
export default apiRouter;
