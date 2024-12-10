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

// API 키 인증 미들웨어
app.use((req, res, next) => {
  const clientApiKey = req.headers['x-api-key']; // 클라이언트가 보낸 API 키를 헤더에서 가져옴
  const serverApiKey = process.env.SERVER_API_KEY; // 서버에 저장된 API 키

  if (!clientApiKey || clientApiKey !== serverApiKey) {
    return res.status(403).json({ error: "Forbidden: Invalid API Key" }); // 인증 실패 시 응답
  }

  next(); // 인증 통과 시 다음 미들웨어로 진행
});

// 라우팅 설정
app.use("/api/schedules", scheduleRoutes); // 공강 시간표 API

// 서버 포트 설정
const PORT = process.env.PORT || 5000;

// 서버 실행
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
