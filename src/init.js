import "regenerator-runtime/runtime.js";
import "dotenv/config";
import app from "./server";
import "./db";
import "./models/Video";
import "./models/User";
import "./models/Comment";

const PORT = process.env.PORT || 4000;

/*
서버 Listening
*/

// listen의 콜백함수
const handleListening = () =>
  console.log(`✅ Server listening on http://localhost:${PORT} 🚀`);

// express 서버의 포트개방 이후, 두번째 인자인 콜백함수를 실행시킨다.
app.listen(PORT, handleListening);
