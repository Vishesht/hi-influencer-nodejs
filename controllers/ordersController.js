const Orders = require("../models/Orders");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/User");

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

exports.updateOrder = async (req, res) => {
  const { id, orderDetails, status, loggedUserId, influencerId } = req.body;
  if (!id || !orderDetails || !loggedUserId || !influencerId || !status) {
    return res.status(400).json({ message: "Required fields are missing" });
  }
  try {
    const existingOrder = await Orders.findById(id);
    if (!existingOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    existingOrder.orderDetails = orderDetails;
    existingOrder.status = status;
    existingOrder.loggedUserId = loggedUserId;
    existingOrder.influencerId = influencerId;
    existingOrder.updatedAt = new Date();
    existingOrder.requestedChanges = null;
    const updatedOrder = await existingOrder.save();
    return res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error updating the order:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getOrderById = async (req, res) => {
  const { userId } = req.params;
  try {
    // Fetch orders matching the loggedUserId
    const orders = await Orders.find({ loggedUserId: userId });
    if (!orders.length) {
      return res.status(404).json({ message: "No orders found for this user" });
    }
    // Iterate over each order to fetch the influencer details
    const ordersWithInfluencers = await Promise.all(
      orders.map(async (order) => {
        try {
          // Fetch the influencer details based on influencerId
          const influencer = await User.findOne({ id: order.influencerId });
          return {
            ...order._doc,
            influencerDetails: {
              name: influencer.name,
              gender: influencer.gender,
              state: influencer.state,
              email: influencer.email,
              address: influencer.address,
              influencerImg: influencer.photoURL,
              reviewsData: influencer.reviewsData.map(
                (review) => review.orderId
              ),
              verified: influencer.verified,
            },
          };
        } catch (err) {
          console.error(
            `Error fetching influencer with ID ${order.influencerId}:`,
            err
          );
          return { ...order._doc, influencerDetails: null }; // Return null if influencer not found
        }
      })
    );

    // Return the orders with influencer details
    return res.status(200).json(ordersWithInfluencers);
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
    const ordersWithInfluencers = await Promise.all(
      orders.map(async (order) => {
        try {
          const user = await User.findOne({ id: order.loggedUserId });
          return {
            ...order._doc,
            influencerDetails: {
              name: user.name,
              gender: user.gender,
              email: user.email,
              state: user.state,
              address: user.address,
              influencerImg: user.photoURL,
              verified: user.verified,
            },
          };
        } catch (err) {
          console.error(
            `Error fetching influencer with ID ${order.influencerId}:`,
            err
          );
          return { ...order._doc, influencerDetails: null };
        }
      })
    );

    // Return the orders
    return res.status(200).json(ordersWithInfluencers);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//Admin
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Orders.find();
    const ordersWithInfluencers = await Promise.all(
      orders.map(async (order) => {
        try {
          // Fetch the influencer details based on influencerId
          const user = await User.findOne({ id: order.loggedUserId });
          const influencer = await User.findOne({ id: order.influencerId });
          return {
            ...order._doc,
            influencerDetails: {
              name: influencer.name,
              gender: influencer.gender,
              state: influencer.state,
              address: influencer.address,
              influencerImg: influencer.photoURL,
              verified: influencer.verified,
              phone: influencer.phoneNumber,
              email: influencer.email,
            },
            loggedUserId: {
              name: user.name,
              gender: user.gender,
              state: user.state,
              address: user.address,
              influencerImg: user.photoURL,
              verified: user.verified,
              phone: user.phoneNumber,
              email: user.email,
            },
          };
        } catch (err) {
          console.error(
            `Error fetching influencer with ID ${order.influencerId}:`,
            err
          );
          return { ...order._doc, influencerDetails: null }; // Return null if influencer not found
        }
      })
    );
    res.json(ordersWithInfluencers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.requestedChanges = async (req, res) => {
  const { _id, requestedChanges } = req.body;
  if (!_id || !requestedChanges) {
    return res.status(400).json({ message: "Required fields are missing" });
  }
  try {
    const updatedOrder = await Orders.findByIdAndUpdate(_id, {
      requestedChanges,
    });

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(updatedOrder);
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
    const updatedOrder = await Orders.findByIdAndUpdate(_id, {
      status: newStatus,
    });
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    return res.status(200).json(updatedOrder); // Return the updated order
  } catch (error) {
    console.error("Error changing the order status:", error); // Log the error
    return res.status(500).json({ message: "Internal server error" });
  }
};
