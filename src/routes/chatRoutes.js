import express from "express";
import { createChat, listChat } from "../controllers/chatController.js";
import authMiddleware from "../middlewares/jwtVerify.js";

const router = express.Router();

router.post("/", createChat); // Create a new chat
// List all Messages
router.get('/listchat',authMiddleware,listChat);


export default router;
