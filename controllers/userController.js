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

    if (!_id) {
      return res
        .status(400)
        .json({ message: "User ID (_id) is required for update." });
    }

    // Check if the user with the provided _id exists
    const existingUser = await User.findById(_id);
    if (existingUser) {
      // If user with _id exists, update the user
      Object.assign(existingUser, { email, ...optionalFields });
      await existingUser.save();
      return res.status(200).json(existingUser);
    } else {
      // If user with _id does not exist, check if email is taken
      const emailTaken = await User.findOne({ email });
      if (emailTaken) {
        // If email exists but _id does not match, return an error
        return res
          .status(400)
          .json({
            message: "Email already exists but does not match the provided ID",
          });
      }
      // If email is not taken, create a new user
      const newUser = new User({ email, ...optionalFields });
      await newUser.save();
      return res.status(201).json(newUser);
    }
  } catch (error) {
    console.error("Error updating or creating user:", error);
    res.status(400).json({ message: error.message });
  }
};
