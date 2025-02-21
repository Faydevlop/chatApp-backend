import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import connectDB from "./config/db.js";
import setupMorgan from "./config/morgan.js";  // ✅ Import Morgan setup

// Load environment variables
dotenv.config();

// Initialize Express App
const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());
app.use(urlencoded({ extended: true }));

// ✅ Setup logging
setupMorgan(app);

// Connect Database
await connectDB();

// Import Routes
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/messages", messageRoutes);

// Server Listening
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
