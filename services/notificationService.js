const admin = require("../config/firebaseAdmin");

const sendNotification = async (token, notification) => {
  try {
    const message = {
      token,
      notification: {
        title: notification.title,
        body: notification.body,
      },
    };
    const response = await admin.messaging().send(message);
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { sendNotification };
