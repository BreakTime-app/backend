const express = require("express");
const User = require("../models/User");

const router = express.Router();

// 프로필 사진 업데이트 라우터
router.put("/update-profile-image", async (req, res) => {
  const { userid, profileImage } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { userid },
      { profileImage },
      { new: true } // 업데이트 후 새로운 데이터를 반환
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile image updated successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;