import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: "" },
    otp: { type: String }, 
    isVerified: { type: Boolean, default: false },
    onlineStatus: { type: String, enum: ["online", "offline"], default: "offline" },
    lastSeen: { type: Date, default: Date.now },
    otpExpires: { type: Date }, 

  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
