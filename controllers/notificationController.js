const Login = require("../models/Login");
const Notification = require("../models/NotificationModal");
const { sendNotification } = require("../services/notificationService");
const { v4: uuidv4 } = require("uuid");

exports.sendNotification = async (req, res) => {
  let { email, title, body } = req.body;
  if (!email || !title || !body) {
    return res
      .status(400)
      .json({ message: "Email, title, and body are required" });
  }

  // Define the pattern for checking if the title contains the "sent a message" phrase
  const messagePattern = /(.*) sent a message$/i;

  // If the title matches the pattern, extract the name and modify the title
  const match = title.match(messagePattern);
  if (match) {
    title = match[1]; // Extracted name (Vishesht Gupta)
  }

  try {
    const user = await Login.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Modify the notification object
    const notification = { title, body };
    const response =
      user.fcmToken && (await sendNotification(user.fcmToken, notification));

    if (!match) {
      // Save the notification in the database
      const newNotification = new Notification({
        id: uuidv4(),
        email,
        title, // Here the title will be the extracted name (e.g., Vishesht Gupta)
        body,
        read: false,
      });

      await newNotification.save();

      res.status(200).json({
        message: "Notification sent and saved successfully",
        response,
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending notification", error: error.message });
  }
};

exports.markNotificationAsRead = async (req, res) => {
  const { id } = req.body; // Assuming you pass the notification ID to mark it as read

  if (!id) {
    return res.status(400).json({ message: "Notification ID is required" });
  }

  try {
    const notification = await Notification.findByIdAndUpdate(
      id,
      { read: true }, // Set read to true
      { new: true } // Return the updated document
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res
      .status(200)
      .json({ message: "Notification marked as read", notification });
  } catch (error) {
    res.status(500).json({
      message: "Error marking notification as read",
      error: error.message,
    });
  }
};

exports.getUserNotifications = async (req, res) => {
  const { email } = req.params;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  try {
    const notifications = await Notification.find({ email });
    res
      .status(200)
      .json({ message: "Notifications retrieved successfully", notifications });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching notifications", error: error.message });
  }
};

exports.markAllAsRead = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  try {
    const result = await Notification.updateMany(
      { email, read: false },
      { $set: { read: true } }
    );
    res.status(200).json({
      message: "All notifications marked as read",
      updatedCount: result.nModified,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error marking notifications as read",
      error: error.message,
    });
  }
};
