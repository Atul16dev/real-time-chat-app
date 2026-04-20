import express from "express";
import {  getMessages, getUsersForSidebar, markMessageAsSeen, sendMessage } from "../controllers/messageController.js";
import { protectRoute } from "../middleware/auth.js";

const messageRouter = express.Router();

// 📥 Get all users for sidebar
messageRouter.get("/users", protectRoute, getUsersForSidebar);

// 📥 Get messages between two users
messageRouter.get("/:id", protectRoute, getMessages);

messageRouter.put("/mark/:id" ,protectRoute , markMessageAsSeen  )

// 📤 Send message
messageRouter.post("/send/:id", protectRoute, sendMessage);

export default messageRouter;