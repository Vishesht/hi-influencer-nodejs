const admin = require("firebase-admin");

// Load Firebase Admin SDK credentials
const serviceAccount = require("./hiinfluencer-1c689-firebase-adminsdk-i2bpz-5136e4ce63.json");

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://hiinfluencer-1c689.firebaseio.com",
});

module.exports = admin;
