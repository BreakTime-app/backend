const express = require("express");
const Schedule = require("../models/Schedule");
const router = express.Router();

// 사용자 시간표 추가
router.post("/add", async (req, res) => {
  try {
    const { user, classes } = req.body;

    // 기존 시간표가 있는지 확인
    let schedule = await Schedule.findOne({ user });
    if (schedule) {
      // 기존 시간표에 새 수업 추가
      schedule.classes.push(...classes);
      await schedule.save();
      res.status(200).json({ message: "Classes added to existing schedule", data: schedule });
    } else {
      // 새 시간표 생성
      const newSchedule = new Schedule(req.body);
      await newSchedule.save();
      res.status(201).json({ message: "Schedule created successfully", data: newSchedule });
    }
  } catch (error) {
    res.status(500).json({ message: "Error adding classes to schedule", error });
  }
});

// 사용자 시간표 조회
router.get("/:userId", async (req, res) => {
  try {
    const schedule = await Schedule.findOne({ user: req.params.userId }).populate("user", "username");
    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }
    res.status(200).json(schedule);
  } catch (error) {
    res.status(500).json({ message: "Error fetching schedule", error });
  }
});

// 사용자 시간표 수정
router.put("/:userId/class/:classId", async (req, res) => {
  try {
    const { userId, classId } = req.params;
    const updatedClass = req.body;

    const schedule = await Schedule.findOne({ user: userId });
    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    const classIndex = schedule.classes.findIndex((cls) => cls._id.equals(classId));
    if (classIndex === -1) {
      return res.status(404).json({ message: "Class not found" });
    }

    schedule.classes[classIndex] = { ...schedule.classes[classIndex]._doc, ...updatedClass };
    await schedule.save();

    res.status(200).json({ message: "Class updated successfully", data: schedule });
  } catch (error) {
    res.status(500).json({ message: "Error updating class", error });
  }
});

// 사용자 시간표에서 수업 삭제
router.delete("/:userId/class/:classId", async (req, res) => {
  try {
    const { userId, classId } = req.params;

    const schedule = await Schedule.findOne({ user: userId });
    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    schedule.classes = schedule.classes.filter((cls) => !cls._id.equals(classId));
    await schedule.save();

    res.status(200).json({ message: "Class removed successfully", data: schedule });
  } catch (error) {
    res.status(500).json({ message: "Error removing class", error });
  }
});

module.exports = router;
