import express from "express";
import { blockLoggedInUserMiddleware } from "../middlewares";
import { home, search } from "../controllers/videoController";
import { getJoin, postJoin, getLogin, postLogin } from "../controllers/userController";


const rootRouter = express.Router();


rootRouter.get("/", home);
rootRouter.route("/join")
    .all(blockLoggedInUserMiddleware)
    .get(getJoin)
    .post(postJoin);
rootRouter.route("/login")
    .all(blockLoggedInUserMiddleware)
    .get(getLogin)
    .post(postLogin);
rootRouter.get("/search/:groupName", search);


export default rootRouter;