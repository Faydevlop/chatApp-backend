import express from "express";
import { createChat, getChats } from "../controllers/chatController.js";

const router = express.Router();

router.post("/", createChat); // Create a new chat
router.get("/:userId", getChats); // Get all chats for a user

export default router;
