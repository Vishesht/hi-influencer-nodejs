const express = require("express");
const router = express.Router();
const { sendNotification } = require("../controllers/notificationController");
const { createChat, getUserChats } = require("../controllers/chatController");

router.post("/send-notification", sendNotification);
router.post("/create-chat", createChat);
router.get("/chat/:userId", getUserChats);

module.exports = router;
