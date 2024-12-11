const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

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

module.exports = router;
