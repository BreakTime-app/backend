const express = require("express");
const mongoose = require("mongoose");
const Group = require("../models/Group");
const User = require("../models/User");
const router = express.Router();

/**
 * @swagger
 * /api/groups/create:
 *   post:
 *     summary: 그룹 생성
 *     description: 새로운 그룹을 생성합니다.
 *     tags: [Groups]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               groupName:
 *                 type: string
 *               description:
 *                 type: string
 *               adminId:
 *                 type: string
 *                 description: 그룹 관리자 ID
 *     responses:
 *       201:
 *         description: 그룹 생성 성공
 *       500:
 *         description: 서버 에러
 */

/**
 * @swagger
 * /api/groups/{groupId}/invite:
 *   post:
 *     summary: 그룹원 초대
 *     description: 그룹에 새로운 사용자를 초대합니다. 초대는 관리자만 할 수 있습니다.
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         description: 그룹 ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userid:
 *                 type: string
 *                 description: 초대할 사용자 ID
 *               adminId:
 *                 type: string
 *                 description: 그룹 관리자 ID
 *     responses:
 *       200:
 *         description: 그룹원 초대 성공
 *       403:
 *         description: 관리자만 초대할 수 있습니다
 *       404:
 *         description: 그룹 또는 사용자를 찾을 수 없음
 *       500:
 *         description: 서버 에러
 */

/**
 * @swagger
 * /api/groups/{groupId}/remove:
 *   delete:
 *     summary: 그룹원 추방
 *     description: 그룹에서 사용자를 추방합니다. 추방은 관리자만 할 수 있습니다.
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         description: 그룹 ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userid:
 *                 type: string
 *                 description: 추방할 사용자 ID
 *               adminId:
 *                 type: string
 *                 description: 그룹 관리자 ID
 *     responses:
 *       200:
 *         description: 그룹원 추방 성공
 *       403:
 *         description: 관리자만 추방할 수 있습니다
 *       404:
 *         description: 그룹 또는 사용자를 찾을 수 없음
 *       500:
 *         description: 서버 에러
 */

/**
 * @swagger
 * /api/groups/{groupId}:
 *   get:
 *     summary: 그룹 조회
 *     description: 특정 그룹의 정보를 조회합니다.
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         description: 그룹 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 그룹 정보 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: 그룹을 찾을 수 없음
 *       500:
 *         description: 서버 에러
 */

// 그룹 생성
router.post("/create", async (req, res) => {
  try {
    const { groupName, description, adminId } = req.body;

    // adminId를 ObjectId로 변환
    const adminObjectId = new mongoose.Types.ObjectId(adminId);

    // 그룹 생성
    const newGroup = new Group({
      groupName,
      description,
      admin: adminObjectId,
      members: [{ user: adminObjectId }],
    });

    await newGroup.save();
    res.status(201).json({ message: "Group created successfully", data: newGroup });
  } catch (error) {
    res.status(500).json({ message: "Error creating group", error });
  }
});

// 그룹원 초대
router.post("/:groupId/invite", async (req, res) => {
    try {
      const { groupId } = req.params;
      const { userid, adminId } = req.body;
  
      // 그룹 찾기
      const group = await Group.findById(groupId);
      if (!group) return res.status(404).json({ message: "Group not found" });
  
      // 관리자 확인
      if (!group.admin.equals(adminId)) {
        return res.status(403).json({ message: "Only the admin can invite members" });
      }
  
      // 초대할 사용자 찾기 (userid로 검색)
      const userToInvite = await User.findOne({ userid });
      if (!userToInvite) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // 중복 확인
      if (group.members.some((member) => member.user.equals(userToInvite._id))) {
        return res.status(400).json({ message: "User is already a member of this group" });
      }
  
      // 멤버 추가
      group.members.push({ user: userToInvite._id });
      await group.save();
  
      res.status(200).json({ message: "Member added successfully", data: group });
    } catch (error) {
      res.status(500).json({ message: "Error inviting member", error });
    }
  });
  

// 그룹원 추방
router.delete("/:groupId/remove", async (req, res) => {
    try {
      const { groupId } = req.params;
      const { userid, adminId } = req.body;
  
      // 그룹 찾기
      const group = await Group.findById(groupId);
      if (!group) return res.status(404).json({ message: "Group not found" });
  
      // 관리자 확인
      if (!group.admin.equals(adminId)) {
        return res.status(403).json({ message: "Only the admin can remove members" });
      }
  
      // 제거할 사용자 찾기 (userid로 검색)
      const userToRemove = await User.findOne({ userid });
      if (!userToRemove) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // 멤버 삭제
      group.members = group.members.filter(
        (member) => !member.user.equals(userToRemove._id)
      );
      await group.save();
  
      res.status(200).json({ message: "Member removed successfully", data: group });
    } catch (error) {
      res.status(500).json({ message: "Error removing member", error });
    }
  });
  

// 그룹 조회
router.get("/:groupId", async (req, res) => {
    try {
      const { groupId } = req.params;
  
      // 그룹 찾기 및 members 정보 populate
      const group = await Group.findById(groupId)
        .populate("members.user", "userid username profileImage")
        .populate("admin", "userid username profileImage");
  
      if (!group) return res.status(404).json({ message: "Group not found" });
  
      res.status(200).json({ data: group });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching group", error });
    }
  });
  

module.exports = router;
