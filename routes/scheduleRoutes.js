const express = require("express");
const Schedule = require("../models/Schedule");
const router = express.Router();

// 공강 시간표 추가
router.post("/add", async (req, res) => {
  try {
    const newSchedule = new Schedule(req.body);
    await newSchedule.save();
    res.status(201).json({ message: "Schedule added successfully", data: newSchedule });
  } catch (error) {
    res.status(500).json({ message: "Error adding schedule", error });
  }
});

// 공강 시간표 조회
router.get("/:studentId", async (req, res) => {
  try {
    const schedules = await Schedule.find({ studentId: req.params.studentId });
    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({ message: "Error fetching schedules", error });
  }
});

// 공강 시간표 삭제
router.delete("/:id", async (req, res) => {
  try {
    await Schedule.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Schedule deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting schedule", error });
  }
});

module.exports = router;
