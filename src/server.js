import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import { localMiddleware } from "./middlewares";
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
app.use(session({
    secret: "Hello!",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: "mongodb://127.0.0.1:27017/wetube" }),
}))
app.use((req, res, next) => {
    req.sessionStore.all((error, sessions) => {
        console.log(sessions);
        next();
    });
});
app.use(localMiddleware);



/*
사용 Router 모음
*/
app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);


export default app;