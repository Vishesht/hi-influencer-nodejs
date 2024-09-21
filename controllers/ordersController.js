const Orders = require("../models/Orders");
const { v4: uuidv4 } = require("uuid");

exports.saveneworder = async (req, res) => {
  const { orderDetails, status, loggedUserId, influencerId } = req.body;
  // Validate the incoming data
  if (!orderDetails || !loggedUserId || !influencerId || !status) {
    return res.status(400).json({ message: "Required fields are missing" });
  }

  try {
    // Create a new order instance
    const newOrder = new Orders({
      id: uuidv4(),
      orderDetails: orderDetails,
      status: status,
      loggedUserId: loggedUserId,
      influencerId: influencerId,
      createdAt: new Date(),
    });

    // Save the new order to the database
    const savedOrder = await newOrder.save();

    // Return the saved order
    return res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error saving the order:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getOrderById = async (req, res) => {
  const { userId } = req.params;
  try {
    // Fetch orders matching the loggedUserId
    const orders = await Orders.find({ loggedUserId: userId });

    // If no orders found, return a 404
    if (!orders.length) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    // Return the orders
    return res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getOrderByInfluencerId = async (req, res) => {
  const { userId } = req.params;
  try {
    // Fetch orders matching the loggedUserId
    const orders = await Orders.find({ influencerId: userId });
    // If no orders found, return a 404
    if (!orders.length) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    // Return the orders
    return res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//Admin
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Orders.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.changeStatus = async (req, res) => {
  const { _id, newStatus } = req.body;
  if (!_id || !newStatus) {
    return res.status(400).json({ message: "Required fields are missing" });
  }
  try {
    const updatedOrder = await Orders.findByIdAndUpdate(
      _id,
      { status: newStatus },
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    return res.status(200).json(updatedOrder); // Return the updated order
  } catch (error) {
    console.error("Error changing the order status:", error); // Log the error
    return res.status(500).json({ message: "Internal server error" });
  }
};
