const express = require("express");
const router = express.Router();
const {
  sendNotification,
  markNotificationAsRead,
  getUserNotifications,
  markAllAsRead,
} = require("../controllers/notificationController");
const { createChat, getUserChats } = require("../controllers/chatController");

router.post("/send-notification", sendNotification);
router.post("/mark-notification-read", markNotificationAsRead);
router.get("/notifications/:email", getUserNotifications);
router.post("/notifications/mark-all-read", markAllAsRead);
router.post("/create-chat", createChat);
router.get("/chat/:userId", getUserChats);

module.exports = router;
