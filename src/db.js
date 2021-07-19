import mongoose from "mongoose";

// Local에서 실행중인 MongoDB와 연결
mongoose.connect("mongodb://127.0.0.1:27017/wetube", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
});

// 밑에서 mongoose.connection.on(...)이렇게 해도 되지만, 코드를 깔끔하게 하기 위해 db변수에 정의
const db = mongoose.connection;


const handleOpen = () => {
    console.log("✅ Connected to MongoDB");
}

const handleError = (error) => {
    console.log("❌ DB Error:", error)
}

db.on("error", handleError);
db.once("open", handleOpen);