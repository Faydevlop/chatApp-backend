import { Server } from "socket.io";
import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import dotenv from "dotenv"

dotenv.config();

const socketServer = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.FRONT_END_ROUTE,
            methods: ["GET", "POST"],
            credentials: true,  // Allow credentials
        },
    });

    io.on("connection", (socket) => {
        console.log(`🔗 User connected: ${socket.id}`);

        // Handle user joining a room (based on userId)
        socket.on("joinRoom", (userId) => {
            socket.join(userId);  // User joins a room with their userId
            console.log(`👥 User ${userId} joined their room.`);
        });

        // Send message
        socket.on("sendMessage", async ({ sender, receiver, message, messageType }) => {
            try {
                let chat = await Chat.findOne({
                    participants: { $all: [sender, receiver] },
                });

                if (!chat) {
                    chat = new Chat({
                        participants: [sender, receiver],
                    });

                    await chat.save();
                }

                const newMessage = new Message({
                    chatId: chat._id,
                    sender,
                    message,
                    messageType,
                });
                await newMessage.save();

                chat.lastMessage = newMessage._id;
                await chat.save();

                console.log(`📩 Message sent from ${sender} to ${receiver}`);

                // Emit message to receiver's room
                io.to(sender).emit("receiveMessage", newMessage);
                io.to(receiver).emit("receiveMessage", newMessage);
            } catch (error) {
                console.error("❌ Error sending message:", error);
            }
        });

        // Handle user disconnect
        socket.on("disconnect", () => {
            console.log(`❌ User disconnected: ${socket.id}`);
        });
    });

    return io;
};

export default socketServer;
