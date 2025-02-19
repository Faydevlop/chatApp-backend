import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

// Create New Chat
export const createChat = async (req, res) => {
  try {
    const { userId1, userId2 } = req.body;

    let chat = await Chat.findOne({ participants: { $all: [userId1, userId2] } });

    if (!chat) {
      chat = await Chat.create({ participants: [userId1, userId2] });
    }

    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Chats for a User
export const getChats = async (req, res) => {
  try {
    const userId = req.params.userId;
    const chats = await Chat.find({ participants: userId }).populate("participants", "-password");
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
