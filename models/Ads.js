const mongoose = require("mongoose");

const adsSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  isInfluencer: { type: Boolean, required: true },
  photoURL: { type: String },
  adsImages: [{ type: String }],
  state: { type: String },
  title: { type: String, required: true },
  desc: { type: String, required: true },
  category: { type: String },
  budget: { type: String },
  applicants: [{ type: String }],
  accepted: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

const Ads = mongoose.model("Ads", adsSchema);

// Ensure the index is dropped if it exists
Ads.on("index", (error) => {
  if (error) {
    console.error("Index error:", error);
  }
});

// Use syncIndexes to update the indexes in the database
Ads.syncIndexes();

module.exports = Ads;
