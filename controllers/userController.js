const mongoose = require("mongoose");
const User = require("../models/User");

// Get a user by ID
exports.getUser = async (req, res) => {
  try {
    // Convert the string ID to ObjectId
    const userId = new mongoose.Types.ObjectId(req.params.id);
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: error.message });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const newUser = new User(req.body); // Use req.body directly if it matches the schema
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(400).json({ message: error.message });
  }
};
