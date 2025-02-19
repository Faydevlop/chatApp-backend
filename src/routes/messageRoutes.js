import express from "express";
import { sendMessage, getMessages } from "../controllers/messageController.js";

const router = express.Router();

router.post("/", sendMessage); // Send a message
router.get("/:chatId", getMessages); // Get messages from a chat

export default router;
