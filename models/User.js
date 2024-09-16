const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: { type: String, required: false, unique: true },
  username: { type: String, required: false },
  name: { type: String, required: false },
  email: { type: String, unique: true },
  isInfluencer: { type: Boolean, required: false },
  phoneNumber: { type: String, required: false },
  photoURL: { type: String, required: false },
  gender: { type: String, required: false },
  dob: { type: String, required: false },
  state: { type: String, required: false },
  bio: { type: String, required: false },
  platform: [
    {
      platform: { type: String, required: false },
      followers: { type: String, required: false },
      platformLink: { type: String, required: false },
    },
  ],
  address: { type: String, required: false },
  images: [{ type: String, required: false }],
  category: { type: String, required: false },
  packages: [
    {
      type: { type: String, required: false },
      price: { type: String, required: false },
      duration: { type: String, required: false },
      reach: { type: String, required: false },
      engagement: { type: String, required: false },
    },
  ],
  reviewsData: [
    {
      user: { type: String, required: false },
      rating: { type: Number, required: false },
      comment: { type: String, required: false },
    },
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
