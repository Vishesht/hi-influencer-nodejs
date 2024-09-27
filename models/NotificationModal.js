const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  email: { type: String, required: true },
  title: { type: String, required: true },
  body: { type: String, required: false },
  read: { type: Boolean, default: false, required: false },
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
