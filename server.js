// 환경변수 로드
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const scheduleRoutes = require("./routes/scheduleRoutes");
const loginRoutes = require("./routes/login"); // 로그인 라우터 파일 이름 변경

const app = express();

// MongoDB 연결
connectDB();

// JSON 데이터 파싱
app.use(express.json());

// API 키 인증 미들웨어
app.use((req, res, next) => {
  const clientApiKey = req.headers['x-api-key'];
  const serverApiKey = process.env.SERVER_API_KEY;

  if (!clientApiKey || clientApiKey !== serverApiKey) {
    return res.status(403).json({ error: "Forbidden: Invalid API Key" });
  }

  next();
});

// 라우팅 설정
app.use("/api/schedules", scheduleRoutes); // 공강 시간표 API
app.use("/api/auth", loginRoutes); // 로그인 및 회원가입 라우트
app.use((err, req, res, next) => {
  console.error(err.stack); // 에러 스택을 콘솔에 출력
  res.status(500).json({ message: "Server error", error: err.message }); // 클라이언트에게 에러 메시지 전송
});

// 서버 포트 설정
const PORT = process.env.PORT || 5000;

// 서버 실행
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
