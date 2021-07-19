import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";


/*
express 서버 생성
*/
const app = express();
app.set("view engine", "pug");
app.set("views", `${process.cwd()}/src/views`);




/*
Middleware 모음
*/
const logger = morgan("dev");
app.use(logger)
app.use(express.urlencoded({ extended: true }))



/*
사용 Router 모음
*/
app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);


export default app;