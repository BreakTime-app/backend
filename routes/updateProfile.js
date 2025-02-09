const express = require("express");
const User = require("../models/User");

const router = express.Router();

/**
 * @swagger
 * /api/updateProfile/update-profile-image:
 *   put:
 *     summary: 프로필 이미지 업데이트
 *     description: 사용자의 프로필 이미지를 업데이트합니다.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userid:
 *                 type: string
 *                 description: 사용자 ID
 *               profileImage:
 *                 type: string
 *                 description: 새 프로필 이미지 URL
 *     responses:
 *       200:
 *         description: 프로필 이미지 업데이트 성공
 *       404:
 *         description: 사용자를 찾을 수 없음
 *       500:
 *         description: 서버 에러
 */


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