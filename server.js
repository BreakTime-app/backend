// 환경변수 로드
require("dotenv").config();

// 패키지 임포트
const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const scheduleRoutes = require("./routes/scheduleRoutes");

const app = express();

// MongoDB 연결
connectDB();

// JSON 데이터 파싱
app.use(express.json());

// 라우팅 설정
app.use("/api/schedules", scheduleRoutes); // 공강 시간표 API

// 서버 포트 설정
const PORT = process.env.PORT || 5000;

// 서버 실행
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
