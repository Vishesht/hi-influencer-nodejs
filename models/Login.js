const mongoose = require("mongoose");

const loginSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  name: String,
  email: { type: String, unique: true },
  gmailLogin: { type: Boolean, require: true },
  password: { type: String, require: false },
});

const Login = mongoose.model("Login", loginSchema);

module.exports = Login;
