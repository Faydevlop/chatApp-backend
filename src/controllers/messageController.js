import Message from "../models/Message.js";
import Chat from "../models/Chat.js";

// Send Message
export const sendMessage = async (req, res) => {
  try {
    const { chatId, sender, message } = req.body;

    const newMessage = await Message.create({ chatId, sender, message });

    await Chat.findByIdAndUpdate(chatId, { lastMessage: newMessage._id });

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Messages from a Chat
export const getMessages = async (req, res) => {
  try {
    const chatId = req.params.chatId;
    const messages = await Message.find({ chatId }).populate("sender", "username");
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
