import express from "express";
import { protectRoute } from "../middleware/auth.js";
import { signup, updateProfile } from "../controllers/userController.js";
import { login } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/signup" , signup);
userRouter.post("/login" , login);
userRouter.put("/update-profile" , protectRoute);
userRouter.get("/check" , protectRoute , updateProfile);

export default userRouter;
