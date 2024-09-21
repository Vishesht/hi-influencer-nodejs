const Orders = require("../models/Orders");
const User = require("../models/User");
const { v4: uuidv4 } = require("uuid");

exports.saveneworder = async (req, res) => {
  const { loggedUserId, orderDetails, status, influencerId } = req.body;

  if (!loggedUserId || !orderDetails) {
    return res
      .status(400)
      .json({ message: "loggedUserId and Order details are required" });
  }

  try {
    // Generate a new random key for the order
    const newOrderId = uuidv4();

    const existingOrder = await Orders.findOne({ id: loggedUserId });
    if (existingOrder) {
      existingOrder.userOrders.push({
        id: newOrderId, // Set the new order ID
        orderDetails,
        status,
        influencerId,
        createdAt: new Date(),
      });

      await existingOrder.save();

      return res
        .status(200)
        .json({ message: "Order updated successfully", order: existingOrder });
    } else {
      const newOrder = new Orders({
        id: loggedUserId,
        userOrders: [
          {
            id: newOrderId, // Set the new order ID
            orderDetails,
            status,
            influencerId,
            createdAt: new Date(),
          },
        ],
      });

      await newOrder.save();

      return res
        .status(201)
        .json({ message: "New Order saved successfully", order: newOrder });
    }
  } catch (err) {
    console.error("Error saving order:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  const { userId } = req.params;

  try {
    const order = await Orders.findOne({ id: userId });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Map userOrders to include user details
    const userOrdersWithDetails = await Promise.all(
      order.userOrders.map(async (userOrder) => {
        const user = await User.findOne({ id: userOrder.influencerId });

        return {
          status: userOrder.status,
          influencerId: userOrder.influencerId,
          influencerDetails: user
            ? {
                id: user.id,
                name: user.name,
                username: user.username,
                email: user.email,
                photoURL: user.photoURL,
              }
            : null,
          orderDetails: userOrder.orderDetails,
          createdAt: userOrder.createdAt,
          _id: userOrder._id,
        };
      })
    );

    res.status(200).json({
      _id: order._id,
      id: order.id,
      userOrders: userOrdersWithDetails,
      __v: order.__v,
    });
  } catch (err) {
    console.error("Error retrieving order:", err);
    res.status(500).json({ message: "Server error", error: err.message });
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

exports.approveOrder = async (req, res) => {
  const { orderId } = req.body;

  if (!orderId) {
    return res.status(400).json({ message: "Order ID is required" });
  }

  try {
    // Find the order by ID
    const order = await Orders.findOne({ "userOrders._id": orderId });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Find the specific userOrder to update
    const userOrderIndex = order.userOrders.findIndex(
      (userOrder) => userOrder._id.toString() === orderId
    );

    if (userOrderIndex === -1) {
      return res.status(404).json({ message: "User order not found" });
    }

    // Get the userOrder object
    const userOrder = order.userOrders[userOrderIndex];

    // Update the status of the order
    userOrder.status = "Pending for approval";

    await order.save(); // Save the updated order

    // Prepare data for the new order
    const newOrderData = {
      id: userOrder.influencerId, // Use the existing order ID
      orderDetails: userOrder.orderDetails, // Use the same order details
      status: "New", // Set status as "New"
      influencerId: userOrder.influencerId, // Use the influencer ID from the order
    };

    // Create a new order in the Orders collection
    const existingOrder = await Orders.findOne({ id: newOrderData.id });

    if (existingOrder) {
      existingOrder.userOrders.push({
        orderDetails: newOrderData.orderDetails,
        status: newOrderData.status,
        influencerId: newOrderData.influencerId,
        createdAt: new Date(),
      });
      await existingOrder.save();
    } else {
      const newOrder = new Orders({
        id: newOrderData.id,
        userOrders: [
          {
            orderDetails: newOrderData.orderDetails,
            status: newOrderData.status,
            influencerId: newOrderData.influencerId,
            createdAt: new Date(),
          },
        ],
      });
      await newOrder.save();
    }

    return res
      .status(200)
      .json({ message: "Order approved successfully", order });
  } catch (err) {
    console.error("Error approving order:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};
