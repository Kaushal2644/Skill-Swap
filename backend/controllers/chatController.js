import Message from "../models/Message.js";
import User from "../models/User.js";
import mongoose from "mongoose";

// Send a message to a user
export const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const receiverId = req.params.userId;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Message text is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    if (receiverId === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot send message to yourself" });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: "User not found" });
    }

    const message = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      text: text.trim(),
    });

    const populated = await message.populate("sender receiver", "name email");

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get conversation with a specific user (paginated)
export const getConversation = async (req, res) => {
  try {
    const otherUserId = req.params.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;

    if (!mongoose.Types.ObjectId.isValid(otherUserId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: otherUserId },
        { sender: otherUserId, receiver: req.user._id },
      ],
    })
      .sort({ createdAt: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("sender receiver", "name email");

    // Mark unread messages from the other user as read
    await Message.updateMany(
      { sender: otherUserId, receiver: req.user._id, read: false },
      { read: true }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get list of conversations (latest message per unique user)
export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }],
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: {
            $cond: [{ $eq: ["$sender", userId] }, "$receiver", "$sender"],
          },
          lastMessage: { $first: "$text" },
          lastMessageAt: { $first: "$createdAt" },
          lastSender: { $first: "$sender" },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ["$receiver", userId] }, { $eq: ["$read", false] }] },
                1,
                0,
              ],
            },
          },
        },
      },
      { $sort: { lastMessageAt: -1 } },
    ]);

    // Populate user info
    const populated = await User.populate(conversations, {
      path: "_id",
      select: "name email skillsOffered",
    });

    const result = populated.map((c) => ({
      user: c._id,
      lastMessage: c.lastMessage,
      lastMessageAt: c.lastMessageAt,
      lastSender: c.lastSender,
      unreadCount: c.unreadCount,
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}