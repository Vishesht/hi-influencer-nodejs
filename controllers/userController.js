const User = require("../models/User");

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
    const users = await User.find({ id: { $ne: userId }, verified: true });
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

exports.addReview = async (req, res) => {
  const { userId, influencerId, rating, review, orderId } = req.body;
  if (!userId || !influencerId || !rating || !review || !orderId) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const influencer = await User.findOne({
      id: influencerId,
      verified: true,
    });
    if (!influencer) {
      return res.status(404).json({ message: "Influencer not found" });
    }
    const newReview = {
      userId,
      influencerId,
      rating,
      review,
      orderId,
      timestamp: new Date(),
    };
    influencer.reviewsData.push(newReview);
    await influencer.save();
    res.status(200).json({
      message: "Review added successfully!",
      reviewsData: influencer.reviewsData,
    });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: "Failed to add review", error });
  }
};

exports.checkUserName = async (req, res) => {
  const { username } = req.query;
  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }
  try {
    const user = await User.findOne({ username: username });
    if (user) {
      return res
        .status(200)
        .json({ available: false, message: "Username is taken" });
    } else {
      return res
        .status(200)
        .json({ available: true, message: "Username is available" });
    }
  } catch (error) {
    console.error("Error checking username availability:", error);
    return res
      .status(500)
      .json({ message: "Error occurred while checking username" });
  }
};

// Edit a package in the user's packages array(not using right now)
exports.editPackage = async (req, res) => {
  const { id } = req.params;
  const { name, newData } = req.body; // 'name' is the package to edit, 'newData' is the updated package data

  if (!name || !newData) {
    return res
      .status(400)
      .json({ message: "'name' and 'newData' are required" });
  }

  try {
    // Find the user
    const user = await User.findOne({ id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the package by 'name' and update it with the new data
    const packageIndex = user.packages.findIndex((pkg) => pkg.name === name);

    if (packageIndex === -1) {
      return res.status(404).json({ message: "Package not found" });
    }

    // Update the package data
    user.packages[packageIndex].data = newData;
    await user.save();

    res.json({ message: "Package updated successfully", user });
  } catch (error) {
    console.error("Error editing package:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete a package from the user's packages array
exports.deletePackage = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body; // 'name' is the package to delete
  if (!name) {
    return res.status(400).json({ message: "'name' is required" });
  }

  try {
    // Find the user
    const user = await User.findOne({ id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the index of the package by 'name'
    const packageIndex = user.packages.findIndex((pkg) => pkg.name === name);

    if (packageIndex === -1) {
      return res.status(404).json({ message: "Package not found" });
    }

    // Remove the package from the array
    user.packages.splice(packageIndex, 1);
    await user.save();

    res.json({ message: "Package deleted successfully", user });
  } catch (error) {
    console.error("Error deleting package:", error);
    res.status(500).json({ message: error.message });
  }
};
