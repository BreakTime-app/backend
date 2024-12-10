const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },  // 앱에서 사용할 별명 (중복 허용)
    userid: { type: String, required: true, unique: true },  // 로그인할 때 사용할 아이디
    password: { type: String, required: true },  // 패스워드
    birthday: { type: Date, required: true },  // 사용자의 생일
  });

// 비밀번호 해싱
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 비밀번호 비교
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
