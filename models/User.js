const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  isInfluencer: Boolean,
  emailVerified: Boolean,
  phoneNumber: String,
  photoURL: String,
  uid: Number,
  id: Number,
  gender: String,
  dob: String,
  state: String,
  platform: [
    {
      platform: String,
      followers: String,
      platformLink: String,
    },
  ],
  location: String,
  age: Number,
  images: [String],
  packages: [
    {
      type: String,
      price: String,
      duration: String,
      reach: String,
      engagement: String,
    },
  ],
  reviewsData: [
    {
      id: String,
      user: String,
      rating: Number,
      comment: String,
    },
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
