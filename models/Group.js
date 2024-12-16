const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  groupName: { type: String, required: true }, // 그룹 이름
  description: { type: String, default: "" }, // 그룹 설명
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // 그룹 관리자 ID
  members: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // 멤버 사용자 ID
      joinedAt: { type: Date, default: Date.now }, // 멤버 가입 날짜
    },
  ],
  schedules: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // 사용자 ID
      freeTimes: [
        {
          day: { type: String, required: true }, // 요일 (예: Monday)
          startTime: { type: String, required: true }, // 시작 시간 (예: "09:00")
          endTime: { type: String, required: true }, // 종료 시간 (예: "10:30")
        },
      ],
    },
  ],
  createdAt: { type: Date, default: Date.now }, // 그룹 생성 날짜
});

// 그룹 멤버 추가
groupSchema.methods.addMember = function (userId) {
  if (!this.members.some((member) => member.user.equals(userId))) {
    this.members.push({ user: userId });
  }
};

// 그룹 멤버 제거
groupSchema.methods.removeMember = function (userId) {
  this.members = this.members.filter((member) => !member.user.equals(userId));
};

const Group = mongoose.model("Group", groupSchema);
module.exports = Group;
