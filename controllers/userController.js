const User = require("../models/User");
const LoginModel = require("../models/Login");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
// Get a user by ID
exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ id });
    if (!user) {
      return res.status(404).json({ message: "Data not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Name, email, and password are required" });
  }

  try {
    // Check if the user already exists
    let user = await LoginModel.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
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

exports.login = async (req, res) => {
  const { name, email, gmailLogin, password } = req.body;
  try {
    if (gmailLogin) {
      if (gmailLogin && !name && !email) {
        return res
          .status(400)
          .json({ message: "Name & Email is required for login" });
      }
      let user = await LoginModel.findOne({ email });
      if (user) {
        user.name = name;
        await user.save();
      } else {
        const newUser = new LoginModel({
          id: uuidv4(),
          name,
          email,
          gmailLogin: true,
        });
        user = await newUser.save();
      }
      res.status(200).json({ message: "User logged in successfully", user });
    } else {
      if (!password || !email) {
        return res
          .status(400)
          .json({ message: "Name and password are required" });
      }
      let user = await LoginModel.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid password" });
      }
      res.status(200).json({ message: "User logged in successfully", user });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Create a new user
exports.updateOrCreateUser = async (req, res) => {
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
    isClient,
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
        isClient,
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
        isClient,
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

exports.getUserList = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const users = await User.find({ id: { $ne: userId }, isInfluencer: true });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAdminUserList = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserDetailsByIds = async (req, res) => {
  const { userIds } = req.body; // Expecting an array of user IDs in the request body

  if (!Array.isArray(userIds) || userIds.length === 0) {
    return res.status(400).json({ message: "User IDs are required" });
  }

  try {
    const users = await User.find({ id: { $in: userIds } }); // Fetch users by IDs
    res.json(users);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.verifyAccount = async (req, res) => {
  const { verified } = req.query;
  const { id } = req.params;
  try {
    const updatedUser = await User.findOneAndUpdate(
      { id },
      {
        isInfluencer: true,
        verified: verified ? true : false,
      }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
