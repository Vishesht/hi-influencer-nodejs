const express = require("express");
const router = express.Router();
const {
  sendNotification,
  markNotificationAsRead,
  getUserNotifications,
} = require("../controllers/notificationController");
const { createChat, getUserChats } = require("../controllers/chatController");

router.post("/send-notification", sendNotification);
router.post("/mark-notification-read", markNotificationAsRead);
router.get("/notifications/:email", getUserNotifications);
router.post("/create-chat", createChat);
router.get("/chat/:userId", getUserChats);

module.exports = router;
