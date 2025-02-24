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

// Controller for listing chat between 2 users
export const listChat = async(req,res)=>{
  try {
    const userId = req.user._id
    const friendId =  req.query.friendId;

    console.log('req for the chat history is here',userId,friendId);
    

    const chat = await Chat.findOne({
      participants: { $all: [userId, friendId] }
    });

    if (!chat) {
      return res.status(200).json({ messages: [] });
    }

    // Fetch all messages in the chat
    const messages = await Message.find({ chatId: chat._id }).sort("createdAt");

    res.status(200).json({ messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching messages" });
  }
}
