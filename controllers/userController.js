const mongoose = require("mongoose");
const User = require("../models/User");
const { v4: uuidv4 } = require("uuid");

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
exports.updateOrCreateUser = async (req, res) => {
  try {
    const { _id, email, ...optionalFields } = req.body;

    if (_id) {
      // If _id is provided, check if the user exists
      const existingUser = await User.findById(_id);
      if (existingUser) {
        // If user exists, update the user details
        Object.assign(existingUser, { email, ...optionalFields });
        await existingUser.save();
        return res.status(200).json(existingUser);
      } else {
        // If user with _id does not exist, check if email is taken
        const emailTaken = await User.findOne({ email });
        if (emailTaken) {
          // If email exists but _id does not match, return the existing user data
          return res.status(200).json(emailTaken);
        }
        // If email is not taken, create a new user
        const newUser = new User({ email, ...optionalFields });
        await newUser.save();
        return res.status(201).json(newUser);
      }
    } else {
      // If _id is not provided, check if email is taken
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        // If email exists, return the existing user data
        return res.status(200).json(existingUser);
      }
      // Create a new user if email is not taken
      const newUser = new User({ email, ...optionalFields });
      await newUser.save();
      return res.status(201).json(newUser);
    }
  } catch (error) {
    console.error("Error updating or creating user:", error);
    res.status(400).json({ message: error.message });
  }
};
