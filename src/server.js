import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";


const PORT = 4000;




/*
express 서버 생성
*/
const app = express();




/*
Middleware 모음
*/
const logger = morgan("dev");
app.use(logger)




/*
사용 Router 모음
*/
app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);




/*
서버 Listening
*/
// listen의 콜백함수
const handleListening = () => console.log(`✅ Server listening on port http://localhost:${PORT} 🚀`);

// express 서버의 포트개방 이후, 두번째 인자인 콜백함수를 실행시킨다.
app.listen(PORT, handleListening);