import mongoose from "mongoose";

// Define the schema for chat messages
const chatMessageSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  question: {
      type: String,
      required: true,
  },
  answer: {
       type: String,
       required: true,
  },
    likeDislike: {
       type: Boolean,
       required: false
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

let ChatMessage;

try {
  // Try to get the existing model
  ChatMessage = mongoose.model("ChatMessage");
} catch (error) {
  // If the model doesn't exist, create it
  ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);
}
export default mongoose.models.ChatMessage|| mongoose.model("ChatMessage", chatMessageSchema);



