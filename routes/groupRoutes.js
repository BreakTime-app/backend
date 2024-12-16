const express = require("express");
const mongoose = require("mongoose");
const Group = require("../models/Group");
const User = require("../models/User");
const router = express.Router();

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
