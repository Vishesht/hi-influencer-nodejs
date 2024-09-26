const Chat = require("../models/Chat");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/User");

exports.createChat = async (req, res) => {
  const { userId1, userId2 } = req.body;

  if (!userId1 || !userId2) {
    return res.status(400).json({ message: "Both user IDs are required" });
  }

  try {
    // Check if a chat between userId1 and userId2 already exists
    const existingChat = await Chat.findOne({
      $or: [
        { userId1, userId2 },
        { userId1: userId2, userId2: userId1 }, // Handle the case where the order is reversed
      ],
    });

    if (existingChat) {
      return res
        .status(200)
        .json({ message: "Chat already exists", chat: existingChat });
    }

    // If no existing chat, create a new one with a generated ID
    const newChat = new Chat({ id: uuidv4(), userId1, userId2 }); // Generate ID using uuid
    await newChat.save();
    res.status(201).json({ message: "Chat saved successfully", chat: newChat });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error saving chat", error: error.message });
  }
};

exports.getUserChats = async (req, res) => {
  const { userId } = req.params; // Extract userId from request parameters

  try {
    // Find chats where either userId1 or userId2 matches the provided userId
    const chats = await Chat.find({
      $or: [{ userId1: userId }, { userId2: userId }],
    });

    if (!chats || chats.length === 0) {
      return res.status(404).json({ message: "No chats found for this user" });
    }

    // Get unique user IDs for userId1 and userId2
    const userIds = [
      ...new Set(chats.flatMap((chat) => [chat.userId1, chat.userId2])),
    ];

    // Fetch user details for both users
    const users = await User.find({ id: { $in: userIds } });

    // Map user data to a dictionary for quick lookup
    const userDataMap = {};
    users.forEach((user) => {
      userDataMap[user.id] = {
        name: user.name,
        photoURL: user.photoURL,
        verified: user.verified,
        isClient: user.isClient,
        email: user.email,
      };
    });

    // Prepare the response data
    const response = chats.map((chat) => {
      const isMyDetails = chat.userId1 === userId; // Check if userId1 matches
      return {
        id: chat.id,
        userId1: chat.userId1,
        userId2: chat.userId2,
        myDetails: isMyDetails
          ? userDataMap[chat.userId1]
          : userDataMap[chat.userId2], // Get user details based on userId match
        influencerDetails: isMyDetails
          ? userDataMap[chat.userId2]
          : userDataMap[chat.userId1], // Get opposite user details
        createdAt: chat.createdAt,
      };
    });

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching chat data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
