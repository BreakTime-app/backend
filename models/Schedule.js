const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  studentId: { type: String, required: true }, // 학생 ID
  timetable: [
    {
      day: { type: String, required: true }, // 요일
      startTime: { type: String, required: true }, // 시작 시간
      endTime: { type: String, required: true }, // 종료 시간
      subject: { type: String, required: true }, // 과목
    },
  ],
});

module.exports = mongoose.model("Schedule", scheduleSchema);
