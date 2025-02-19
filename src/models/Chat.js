import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users in chat
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" }, // Store latest message
  },
  { timestamps: true }
);

export default mongoose.model("Chat", chatSchema);
