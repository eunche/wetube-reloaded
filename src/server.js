import express from "express";


const PORT = 4000;



// app이라는 변수에(관습상 app) express 서버를 생성
const app = express();




/*
Middleware 모음
*/

// 사람들이 이 서버의 웹사이트의 어디를 가려는지 말해주는 미들웨어
const logger = (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
}





/*
일반 Controller 모음
*/
const handleHome = (req, res) => {
    return res.send("루트 페이지 입니다");
};





/*
전역 미들웨어 & 라우트 모음
(서버가 첫번째 인자("/")주소에서 GET 요청을 받았을때, 다음 인자들을 콜백함수로 부른다)
*/
app.get("/", logger, handleHome);




// listen의 콜백함수
const handleListening = () => console.log(`✅ Server listening on port http://localhost:${PORT} 🚀`);

// express 서버의 포트개방 이후, 두번째 인자인 콜백함수를 실행시킨다.
app.listen(PORT, handleListening);