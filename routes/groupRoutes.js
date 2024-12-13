const express = require("express");
const Group = require("../models/Group");
const User = require("../models/User");
const router = express.Router();

// 1. 그룹 생성
router.post("/create", async (req, res) => {
  try {
    const { groupName, description, adminId } = req.body;

    // 그룹 생성
    const newGroup = new Group({
      groupName,
      description,
      admin: adminId,
      members: [{ user: adminId }],
    });

    await newGroup.save();
    res.status(201).json({ message: "Group created successfully", data: newGroup });
  } catch (error) {
    res.status(500).json({ message: "Error creating group", error });
  }
});

// 2. 그룹원 초대
router.post("/:groupId/invite", async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userId, adminId } = req.body;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    // 관리자 확인
    if (!group.admin.equals(adminId)) {
      return res.status(403).json({ message: "Only the admin can invite members" });
    }

    // 중복 확인
    if (group.members.some((member) => member.user.equals(userId))) {
      return res.status(400).json({ message: "User is already a member of this group" });
    }

    // 멤버 추가
    group.members.push({ user: userId });
    await group.save();

    res.status(200).json({ message: "Member added successfully", data: group });
  } catch (error) {
    res.status(500).json({ message: "Error inviting member", error });
  }
});

// 3. 그룹원 추방
router.delete("/:groupId/remove/:userId", async (req, res) => {
  try {
    const { groupId, userId } = req.params;
    const { adminId } = req.body;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    // 관리자 확인
    if (!group.admin.equals(adminId)) {
      return res.status(403).json({ message: "Only the admin can remove members" });
    }

    // 멤버 삭제
    group.members = group.members.filter((member) => !member.user.equals(userId));
    await group.save();

    res.status(200).json({ message: "Member removed successfully", data: group });
  } catch (error) {
    res.status(500).json({ message: "Error removing member", error });
  }
});

// 4. 그룹 조회
router.get("/:groupId", async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId).populate("members.user", "username");
    if (!group) return res.status(404).json({ message: "Group not found" });

    res.status(200).json({ data: group });
  } catch (error) {
    res.status(500).json({ message: "Error fetching group", error });
  }
});

module.exports = router;
