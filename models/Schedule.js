const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // 시간표 소유자
  classes: [
    {
      subject: { type: String, required: true }, // 과목명
      day: { type: String, required: true }, // 요일 (예: Monday)
      startTime: { type: String, required: true }, // 시작 시간 (예: "09:00")
      endTime: { type: String, required: true }, // 종료 시간 (예: "10:30")
      location: { type: String, default: "" }, // 수업 장소
    },
  ],
  createdAt: { type: Date, default: Date.now }, // 시간표 생성 날짜
});

// 사용자 시간표 추가
scheduleSchema.methods.addClass = function (newClass) {
  this.classes.push(newClass);
  return this.save();
};

// 사용자 시간표 수정
scheduleSchema.methods.updateClass = function (classId, updatedClass) {
  const classIndex = this.classes.findIndex((cls) => cls._id.equals(classId));
  if (classIndex !== -1) {
    this.classes[classIndex] = { ...this.classes[classIndex], ...updatedClass };
  }
  return this.save();
};

// 사용자 시간표 삭제
scheduleSchema.methods.removeClass = function (classId) {
  this.classes = this.classes.filter((cls) => !cls._id.equals(classId));
  return this.save();
};

const Schedule = mongoose.model("Schedule", scheduleSchema);
module.exports = Schedule;
