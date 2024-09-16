const User = require("../models/User");
const LoginModel = require("../models/Login");
const { v4: uuidv4 } = require("uuid");

// Get a user by ID
exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required" });
  }
  try {
    let user = await LoginModel.findOne({ email });

    if (user) {
      user.name = name;
      await user.save();
    } else {
      const newUser = new LoginModel({ id: uuidv4(), name, email });
      user = await newUser.save();
    }

    res.status(200).json({ message: "User logged in successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Create a new user
exports.updateOrCreateUser = async (req, res) => {
  console.log("first", req.body);
  const {
    id,
    email,
    username,
    name,
    isInfluencer,
    phoneNumber,
    photoURL,
    gender,
    dob,
    state,
    bio,
    platform,
    address,
    images,
    category,
    packages,
    reviewsData,
  } = req.body;

  if (!email && !id) {
    return res.status(400).json({ message: "Email and Id is required" });
  }

  try {
    let user = await User.findOne({ id });

    if (user) {
      // Update existing user
      Object.assign(user, {
        username,
        name,
        isInfluencer,
        phoneNumber,
        photoURL,
        gender,
        dob,
        state,
        bio,
        platform,
        address,
        images,
        category,
        packages,
        reviewsData,
      });
      await user.save();
    } else {
      // Create new user
      user = new User({
        id,
        email,
        username,
        name,
        isInfluencer,
        phoneNumber,
        photoURL,
        gender,
        dob,
        state,
        bio,
        platform,
        address,
        images,
        category,
        packages,
        reviewsData,
      });
      await user.save();
    }

    res.status(200).json({ message: "User saved successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user by username:", error);
    res.status(500).json({ message: error.message });
  }
};
