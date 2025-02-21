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

    let usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ message: "Username already taken, please choose another one" });
    }

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
      console.log('req is here');
      
  
      const user = await User.findOne({ email }).select("-password");
      if (!user) return res.status(400).json({ message: "User not found" });
  
      if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
  
      if (new Date() > user.otpExpires) return res.status(400).json({ message: "OTP expired" });
  
      user.isVerified = true;
      user.otp = null; // Clear OTP after use
      user.otpExpires = null;
  
      await user.save();
      res.status(200).json({ success: true,message: "Account verified successfully",user });
  
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

    if (!user.isVerified) {
      await User.deleteOne({ email });
      return res.status(400).json({ message: "Account not verified. Please sign up again." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({ success: true,token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const listEmailorUsername = async(req,res)=>{
  try {
    console.log('req is here');
    
    const searchQuery = req.query.searchQuery
    const userId = req.user.id;

    console.log('req is here',searchQuery,userId);
    

    if(!searchQuery){
      return res.status(400).json({message:'Search Query is require'})
    }

    const users = await User.find({
      $or:[
        {username:{$regex:searchQuery,$options:"i"}},
        {email:{$regex:searchQuery,$options:'i'}}
      ],
      _id:{$ne:userId},
    }).select("username email avatar");

    res.status(200).json(users);
    
    

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


export const addFriend = async(req,res)=>{
  try {
    const {userId,friendId} = req.body;
    if (!userId || !friendId) {
      return res.status(400).json({ message: "Both userId and friendId are required." });
    }

    // Prevent users from adding themselves
    if (userId === friendId) {
      return res.status(400).json({ message: "You cannot add yourself as a friend." });
    }

    const user = await User.findByIdAndUpdate(userId,{$addToSet:{friendsList:friendId}},{new:true});
    await User.findByIdAndUpdate(friendId,{ $addToSet: { friendsList: userId } },{ new: true });

    res.status(200).json({ message: "Friend added successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding friend" });
  }
}
 
