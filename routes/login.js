const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

/**
 * @swagger
 * /api/login/register:
 *   post:
 *     summary: 사용자 등록
 *     description: 새로운 사용자를 등록합니다.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               userid:
 *                 type: string
 *               password:
 *                 type: string
 *               birthday:
 *                 type: string
 *                 format: date
 *               profileImage:
 *                 type: string
 *                 description: 프로필 이미지 URL
 *     responses:
 *       201:
 *         description: 회원가입 성공
 *       400:
 *         description: 이미 존재하는 사용자
 *       500:
 *         description: 서버 에러
 */

/**
 * @swagger
 * /api/login/update:
 *   put:
 *     summary: 사용자 정보 수정
 *     description: 기존 사용자 정보를 수정합니다. 수정은 로그인한 사용자만 할 수 있습니다.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               birthday:
 *                 type: string
 *                 format: date
 *               profileImage:
 *                 type: string
 *                 description: 프로필 이미지 URL
 *     responses:
 *       200:
 *         description: 사용자 정보 수정 성공
 *       400:
 *         description: 잘못된 입력
 *       401:
 *         description: 인증되지 않음 (로그인 필요)
 *       500:
 *         description: 서버 에러
 */

/**
 * @swagger
 * /api/login/delete:
 *   delete:
 *     summary: 사용자 탈퇴
 *     description: 사용자가 자신의 계정을 탈퇴합니다. 탈퇴는 로그인한 사용자만 할 수 있습니다.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: 사용자 탈퇴 성공
 *       401:
 *         description: 인증되지 않음 (로그인 필요)
 *       500:
 *         description: 서버 에러
 */

// 사용자 등록
router.post("/register", async (req, res) => {
  const { username, userid, password, birthday, profileImage } = req.body;

  try {
    const userExists = await User.findOne({ userid });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({
      username,
      userid,
      password,
      birthday,
      profileImage: profileImage || "https://example.com/default-profile.jpg", // 기본값 설정
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// 사용자 로그인
router.post("/login", async (req, res) => {
  const { userid, password } = req.body;  // username -> userid

  try {
    const user = await User.findOne({ userid });  // username -> userid
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// 사용자 정보 수정 (회원 수정)
router.put("/update", async (req, res) => {
  const { username, password, birthday, profileImage } = req.body;
  const token = req.headers.authorization?.split(" ")[1]; // Assuming token is passed in Authorization header

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    // Verify token and extract user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user information
    user.username = username || user.username;
    user.password = password || user.password;
    user.birthday = birthday || user.birthday;
    user.profileImage = profileImage || user.profileImage;

    await user.save();
    res.status(200).json({ message: "User information updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// 사용자 탈퇴 (회원 삭제)
router.delete("/delete", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Assuming token is passed in Authorization header

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    // Verify token and extract user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User account deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
