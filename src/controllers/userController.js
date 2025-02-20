import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendVerificationEmail from "../config/nodemailer.js";

// Register User
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    let userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otp = Math.floor(100000 + Math.random() * 900000); 
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 5); // OTP expires in 5 minutes


    // Create new user
    const user = await User.create({
      username,
      email,
      otp,
      isVerified:false,
      password: hashedPassword,
      otpExpires: otpExpiry,
    });

    await sendVerificationEmail(email,otp)
    res.status(200).json({ success: true,message: "OTP Sent Successfull" ,user:user.email});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// verifying OTP
export const verifyOTP = async (req, res) => {
    try {
      const { email, otp } = req.body;
  
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: "User not found" });
  
      if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
  
      if (new Date() > user.otpExpires) return res.status(400).json({ message: "OTP expired" });
  
      user.isVerified = true;
      user.otp = null; // Clear OTP after use
      user.otpExpires = null;
  
      await user.save();
      res.status(200).json({ message: "Account verified successfully" });
  
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

 
