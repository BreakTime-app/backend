// 환경변수 로드
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db");

const scheduleRoutes = require("./routes/scheduleRoutes"); // 사용자 시간표 API
const groupRoutes = require("./routes/groupRoutes"); // 그룹 API 추가
const loginRoutes = require("./routes/login"); // 로그인 라우트
const updateProfileRoutes = require("./routes/updateProfile"); // 프로필 업데이트 라우트

const app = express();

// MongoDB 연결
connectDB();

// JSON 데이터 파싱
app.use(express.json());

// API 키 인증 미들웨어
app.use((req, res, next) => {
  const clientApiKey = req.headers["x-api-key"];
  const serverApiKey = process.env.SERVER_API_KEY;

  if (!clientApiKey || clientApiKey !== serverApiKey) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
});

// 라우트 설정
app.use("/api/schedules", scheduleRoutes);
app.use("/api/groups", groupRoutes);  // 그룹 라우트 추가
app.use("/api/login", loginRoutes);  // 로그인 라우트 추가
app.use("/api/updateProfile", updateProfileRoutes);  // 프로필 업데이트 라우트 추가

// 서버 시작
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
