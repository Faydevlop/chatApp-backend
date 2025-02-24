import express from "express";
import { registerUser, loginUser, verifyOTP, listEmailorUsername, addFriend, listFriends } from "../controllers/userController.js";
import authMiddleware from "../middlewares/jwtVerify.js";

const router = express.Router();

// SignUp Page - User
router.post("/register", registerUser);
// OTP Verification Page - User
router.post('/verifyotp',verifyOTP)
// Login Page - User
router.post("/login", loginUser);
// Search Users - User
router.get("/searchUser",authMiddleware,listEmailorUsername)
// Add Selected User as Friends - User
router.post("/addUser",authMiddleware,addFriend)
// Listing Freinds Based on UserId
router.get('/listFriends',authMiddleware,listFriends)


export default router;
