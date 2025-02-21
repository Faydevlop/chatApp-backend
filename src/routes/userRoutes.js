import express from "express";
import { registerUser, loginUser, verifyOTP, listEmailorUsername } from "../controllers/userController.js";
import authMiddleware from "../middlewares/jwtVerify.js";

const router = express.Router();

router.post("/register", registerUser);
router.post('/verifyotp',verifyOTP)
router.post("/login", loginUser);
router.get("/searchUser",authMiddleware,listEmailorUsername)


export default router;
