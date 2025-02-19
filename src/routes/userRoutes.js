import express from "express";
import { registerUser, loginUser, verifyOTP } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post('/verifyotp',verifyOTP)
router.post("/login", loginUser);


export default router;
