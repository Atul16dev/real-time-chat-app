import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    text: {
      type: String,
      required: false, // Made false to allow image-only messages 
    },

    // optional: for images / files
    image: {
      type: String,
    },
    seen: {
      type:Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;