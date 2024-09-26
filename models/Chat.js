const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  id: { type: String, required: true },
  userId1: { type: String, required: true, ref: "User" },
  userId2: { type: String, required: true, ref: "User" }, // Reference to User model
  createdAt: { type: Date, default: Date.now },
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
