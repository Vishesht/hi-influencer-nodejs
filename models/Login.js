const mongoose = require("mongoose");

const loginSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  name: String,
  email: { type: String, unique: true },
  gmailLogin: { type: Boolean, default: false },
  password: { type: String, required: false },
  firstLogin: { type: Boolean, default: true },
  fcmToken: { type: String, required: false },
  resetToken: { type: String, required: false },
  resetTokenExpiration: { type: Date, required: false },
});

const Login = mongoose.model("Login", loginSchema);

module.exports = Login;
