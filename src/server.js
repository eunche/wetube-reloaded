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
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 10800000,   // 3시간
    },
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
}))
app.use((req, res, next) => {
    req.sessionStore.all((error, sessions) => {
        next();
    });
});
app.use(localMiddleware);



/*
사용 Router 모음
*/
app.use("/uploads", express.static('uploads'));
app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);


export default app;