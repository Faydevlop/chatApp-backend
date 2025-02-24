import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    messageType: { type: String, enum: ["text", "image", "video", "file"], default: "text" },
    seenBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User"}], // Track who has seen the message
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
