import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import {io , userSocketMap}  from "../server.js"

// get all users except the logged in user
export const getUsersForSidebar = async (req , res)=>{
  try{
    const userId = req.user._id;
    const filteredUsers = await User.find({_id: {$ne:userId}}).select
    ("-password");

    //count number of messasge not seen
    const unseenMessages = {}
    const promises = filteredUsers.map(async (user)=> {
      const messages = await Message.find({senderId: user._id , receiverId:
        userId, seen: false})
        if(messages.length > 0){
          unseenMessages[user._id] = messages.length;
        }
    })
    await Promise.all(promises);
    res.json({success: true , users: filteredUsers , unseenMessages })
  } catch(error){
      console.log(error.message);
      res.json({success : false , message: error.message})
  }
}
// get all messages for selected user
export const getMessages = async (req , res) => {
  try{
    const {id : selectedUserId } = req.params;
    const myId = req.user._id;
    
    const messages = await Message.find({
      $or: [
        {senderId: myId , receiverId: selectedUserId},
        {senderId: selectedUserId , receiverId: myId},
      ]
    })
    const unreadMessagesExist = messages.some(msg => msg.senderId.toString() === selectedUserId.toString() && msg.receiverId.toString() === myId.toString() && !msg.seen);

    if (unreadMessagesExist) {
        await Message.updateMany({senderId: selectedUserId , receiverId: myId, seen: false},
          {seen : true}
        );
        
        const senderSocketId = userSocketMap[selectedUserId.toString()];
        if (senderSocketId) {
            io.to(senderSocketId).emit("messagesSeen", { receiverId: myId.toString() });
        }
        
        // Update in memory so they are returned as seen to the client
        messages.forEach((msg) => {
            if (msg.senderId.toString() === selectedUserId.toString() && msg.receiverId.toString() === myId.toString()) {
                msg.seen = true;
            }
        });
    }

    res.json({success: true , messages})


  } catch(error) {
    console.log(error.message);
      res.json({success : false , message: error.message})
  }
}

// api to mark message as seen using message id

export const markMessageAsSeen = async (req , res )=>{
    try{
      const {id} = req.params;
      const message = await Message.findById(id);
      if (message && !message.seen) {
          message.seen = true;
          await message.save();
          // Emit socket event to sender
          const senderSocketId = userSocketMap[message.senderId.toString()];
          if (senderSocketId) {
              io.to(senderSocketId).emit("messageSeen", { messageId: id });
          }
      }
      res.json({success: true})

    } catch(error){
      console.log(error.message);
      res.json({success: false , message:error.message})
      }
}

// send message to selected user
export const sendMessage = async (req, res) => {
  try {
    const { text , image } = req.body;
    const receiverId  = req.params.id;
    const senderId = req.user._id;


    let imageUrl;
    if(image){
         const uploadResponse = await cloudinary.uploader.upload(image)
         imageUrl = uploadResponse.secure_url;


    }

   

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl
    });

    //emit the new message to reciever socket
    const receiverSocketId = userSocketMap[receiverId];
    if(receiverSocketId){
      io.to(receiverSocketId).emit("newMessage" , newMessage)
    }

    res.json({success:true , newMessage});

    

  } catch (error) {
    console.log("Error in sendMessage:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};