const Ads = require("../models/Ads");

exports.postAds = async (req, res) => {
  const {
    id,
    name,
    email,
    isInfluencer,
    phoneNumber,
    photoURL,
    adsImages,
    state,
    title,
    desc,
    category,
    budget,
  } = req.body;

  // Check if required fields are provided
  if (!id || !name) {
    return res
      .status(400)
      .json({ message: "Id, username, and name are required" });
  }

  try {
    const ads = new Ads({
      id,
      name,
      email,
      isInfluencer,
      phoneNumber,
      photoURL,
      adsImages,
      state,
      title,
      desc,
      category,
      budget,
      createdAt: new Date(),
    });

    await ads.save();

    res.status(201).json({ message: "Ad saved successfully", ads });
  } catch (err) {
    console.error("Error saving ad:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getAllAds = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const ads = await Ads.find({ id: { $ne: userId } });
    res.json(ads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserAds = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const ads = await Ads.find({ id: userId });
    if (ads.length === 0) {
      return res.status(404).json({ message: "No ads found for this user" });
    }
    res.json(ads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.editAd = async (req, res) => {
  const { userId } = req.params;
  const updateData = req.body;
  try {
    const updatedAd = await Ads.findByIdAndUpdate(userId, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Ensure that validators are run
    });

    if (!updatedAd) {
      return res.status(404).json({ message: "Ad not found" });
    }

    res.json({ message: "Ad updated successfully", updatedAd });
  } catch (error) {
    console.error("Error updating ad:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// New API to delete an ad by _id
exports.deleteAd = async (req, res) => {
  const { userId } = req.params;

  try {
    const deletedAd = await Ads.findByIdAndDelete(userId);

    if (!deletedAd) {
      return res.status(404).json({ message: "Ad not found" });
    }

    res.json({ message: "Ad deleted successfully", deletedAd });
  } catch (error) {
    console.error("Error deleting ad:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.applyForAd = async (req, res) => {
  const { adId } = req.params; // Get the ad ID from the request parameters
  const { userId } = req.body; // Get the user ID from the request body

  // Check if userId is provided
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    // Find the ad by ID and update its applicants array
    const updatedAd = await Ads.findByIdAndUpdate(
      adId,
      { $addToSet: { applicants: userId } }, // Add userId to applicants if it doesn't exist
      { new: true } // Return the updated document
    );

    if (!updatedAd) {
      return res.status(404).json({ message: "Ad not found" });
    }

    res.json({ message: "Applied for ad successfully", updatedAd });
  } catch (error) {
    console.error("Error applying for ad:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.acceptApplicant = async (req, res) => {
  const { adId, userId } = req.params; // Get the ad ID and user ID from params

  try {
    // Update the ad to move the user ID from applicants to accepted
    const updatedAd = await Ads.findByIdAndUpdate(
      adId,
      {
        $addToSet: { accepted: userId }, // Add userId to accepted array
        $pull: { applicants: userId }, // Remove userId from applicants array
      },
      { new: true } // Return the updated document
    );

    if (!updatedAd) {
      return res.status(404).json({ message: "Ad not found" });
    }

    res.json({ message: "Applicant accepted", updatedAd });
  } catch (error) {
    console.error("Error accepting applicant:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.rejectApplicant = async (req, res) => {
  const { adId, userId } = req.params; // Get the ad ID and user ID from params

  try {
    // Update the ad to remove the user ID from the applicants array
    const updatedAd = await Ads.findByIdAndUpdate(
      adId,
      { $pull: { applicants: userId } }, // Remove userId from applicants array
      { new: true } // Return the updated document
    );

    if (!updatedAd) {
      return res.status(404).json({ message: "Ad not found" });
    }

    res.json({ message: "Applicant rejected", updatedAd });
  } catch (error) {
    console.error("Error rejecting applicant:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
