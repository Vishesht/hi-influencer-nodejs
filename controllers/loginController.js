const LoginModel = require("../models/Login");
const User = require("../models/User");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const Otp = require("../models/Otp");
const { generateOtp, transporter } = require("../services/otpService");
const { credentials } = require("../config/utils");
require("dotenv").config();

// Register a new user
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Name, email, and password are required" });
  }

  try {
    let user = await LoginModel.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new LoginModel({
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
    });

    user = await newUser.save();
    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// User login
exports.login = async (req, res) => {
  const { name, email, gmailLogin, password } = req.body;
  let isUserAvailable = await User.findOne({ email });
  try {
    if (gmailLogin) {
      if (!name || !email) {
        return res
          .status(400)
          .json({ message: "Name & Email are required for login" });
      }

      let user = await LoginModel.findOne({ email });
      if (user) {
        user.name = name;
        user.firstLogin = isUserAvailable ? false : true;
        await user.save();
      } else {
        const newUser = new LoginModel({
          id: uuidv4(),
          name,
          email,
          gmailLogin: true,
          firstLogin: true,
        });
        user = await newUser.save();
      }

      res.status(200).json({
        message: "User logged in successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          gmailLogin: user.gmailLogin,
          firstLogin: user.firstLogin,
        },
      });
    } else {
      if (!password || !email) {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }

      let user = await LoginModel.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      if (!user?.password) {
        return res.status(401).json({
          message:
            "An account with this email address is already associated with a Google login. Please use a different email address or sign in with your existing account.",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid password" });
      }

      user.firstLogin = isUserAvailable ? false : true;
      await user.save();

      res.status(200).json({
        message: "User logged in successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          gmailLogin: user.gmailLogin,
          firstLogin: user.firstLogin,
        },
      });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update FCM token
exports.updateFcmToken = async (req, res) => {
  const { email, fcmToken } = req.body;

  if (!email || !fcmToken) {
    return res
      .status(400)
      .json({ message: "Email and FCM Token are required" });
  }

  try {
    const user = await LoginModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.fcmToken = fcmToken;
    await user.save();
    return res
      .status(200)
      .json({ message: "FCM Token updated successfully", user });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

// Send OTP function
exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  try {
    // Check if the email is registered
    const user = await LoginModel.findOne({
      email,
      $or: [
        { gmailLogin: false }, // Users with gmailLogin set to false
        { gmailLogin: { $exists: false } }, // Users without gmailLogin field
      ],
    });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Email not registered or logged in with Gmail." });
    }

    // Generate OTP
    const otp = generateOtp();
    console.log(`Generated OTP for ${email}: ${otp}`); // For debugging; remove in production

    // Store OTP in database or cache for later verification
    await Otp.create({ email, otp, createdAt: Date.now() });
    const cred = {
      from: credentials.user, // Sender address
      to: email, // Receiver's email
      subject: "Your OTP Code", // Subject line
      text: `Your OTP code is ${otp}. It is valid for 10 minutes.`, // Plain text body
      html: `<p>Your OTP code is <strong>${otp}</strong>. It is valid for <strong>10 minutes</strong>.</p>`, // HTML body
    };
    // Send OTP email
    const info = await transporter.sendMail(cred);

    res.status(200).json({ message: "OTP sent successfully." });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res
      .status(500)
      .json({ message: "Failed to send OTP. Please try again later." });
  }
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Find the OTP entry in the database
    const otpEntry = await Otp.findOne({ email, otp });
    // Check if OTP entry exists and is not expired (e.g., valid for 10 minutes)
    if (!otpEntry) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    const now = Date.now();
    const createdAt = otpEntry.createdAt;

    // OTP is valid for 10 minutes (600000 ms)
    if (now - createdAt > 600000) {
      return res.status(400).json({ message: "OTP has expired." });
    }

    // If OTP is valid, proceed with verification logic (e.g., login user, update status)
    // Here you might want to delete the OTP from the database
    await Otp.deleteOne({ _id: otpEntry._id });

    res.status(200).json({ message: "OTP verified successfully." });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "An error occurred. Please try again." });
  }
};

// Change Password
exports.changePassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res
      .status(400)
      .json({ message: "Email and new password are required." });
  }

  try {
    // Hash the new password using bcrypt
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    await LoginModel.updateOne({ email }, { password: hashedPassword });

    return res.status(200).json({ message: "Password changed successfully." });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to change password. Please try again." });
  }
};

exports.sendNewUserOtp = async (req, res) => {
  const { email } = req.body;
  try {
    const existingUser = await LoginModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists. Please log in." });
    }
    const otp = generateOtp();
    await Otp.create({ email, otp, createdAt: Date.now() });
    await transporter.sendMail({
      from: credentials.user, // Sender address
      to: email, // Receiver's email
      subject: "Your OTP Code", // Subject line
      text: `Your OTP code is ${otp}. It is valid for 10 minutes.`, // Plain text body
      html: `<p>Your OTP code is <strong>${otp}</strong>. It is valid for <strong>10 minutes</strong>.</p>`, // HTML body
    });
    res.status(200).json({ message: "OTP sent successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to send OTP. Please try again later." });
  }
};
