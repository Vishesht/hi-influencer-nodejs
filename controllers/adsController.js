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
    const ads = await Ads.find();
    res.json(ads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
