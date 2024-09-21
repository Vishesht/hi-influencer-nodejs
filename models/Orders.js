const mongoose = require("mongoose");

const ordersSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  status: { type: String },
  loggedUserId: { type: String, required: true },
  influencerId: { type: String, required: true },
  orderDetails: [{ type: Object, required: true }],
  createdAt: { type: Date, default: Date.now },
});

const Orders = mongoose.model("Orders", ordersSchema);

module.exports = Orders;
