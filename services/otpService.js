const nodemailer = require("nodemailer");
const { credentials } = require("../config/utils");

// Create a transporter instance
const transporter = nodemailer.createTransport({
  host: "smtpout.secureserver.net",
  secure: true,
  port: 465,
  // logger: true,
  // debug: true,
  auth: {
    user: credentials.user,
    pass: credentials.pass,
  },
});

// Generate a random OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

// Export the transporter and generateOtp function
module.exports = { transporter, generateOtp };
