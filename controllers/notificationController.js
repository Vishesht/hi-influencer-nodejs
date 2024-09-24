const Login = require("../models/Login");
const { sendNotification } = require("../services/notificationService");

exports.sendNotification = async (req, res) => {
  const { email, title, body } = req.body;

  if (!email || !title || !body) {
    return res
      .status(400)
      .json({ message: "Email, title, and body are required" });
  }

  try {
    const user = await Login.findOne({ email });
    if (!user || !user.fcmToken) {
      return res
        .status(404)
        .json({ message: "User not found or FCM token missing" });
    }

    const notification = { title, body };
    const response = await sendNotification(user.fcmToken, notification);

    res
      .status(200)
      .json({ message: "Notification sent successfully", response });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending notification", error: error.message });
  }
};
