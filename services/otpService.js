const nodemailer = require("nodemailer");

// Create a transporter instance
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: "ibrahim92@ethereal.email",
    pass: "cW5Ga59j8uXCV8EjyY",
  },
});

// Generate a random OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

// Export the transporter and generateOtp function
module.exports = { transporter, generateOtp };
