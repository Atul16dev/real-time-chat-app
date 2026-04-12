import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";


// REGISTER USER
export const signup = async (req, res) => {

  const { fullName, email, password , bio } = req.body;

  try {
    if(!fullName || !email || !password || !bio) {
      return res.json({success:false , message: "Missing Details"})
    }

    // check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create user
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      bio
    });
    
    const token = generateToken(newUser._id)

    res.json({success:true , userData: newUser , token , message:"Account Created Successfully"})
    // response
   /* res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });*/
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGIN USER
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user
    const userData = await User.findOne({ email });
    if (!userData) {
      return res.status(400).json({ message: "User not found" });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // response

    const token = generateToken(userData._id)

    res.json({success:true , userData , token , message:"Account Login Successfully"})
   /* res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });*/
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// controller to check user is authenticatd

export const checkAuth = (req , res)=> {
  res.json({success :true , user:req.user});
}

// controller to update user profile details
export const updateProfile = async (req , res) => {
  try {
    const { profilePic, bio, fullName } = req.body;
    const userId = req.user._id;

    let updatedUser;

    if (!profilePic) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { bio, fullName },
        { returnDocument: "after" }
      );
    } else {
      const upload = await cloudinary.uploader.upload(profilePic);

      updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          profilePic: upload.secure_url,
          bio,
          fullName
        },
        { returnDocument: "after" }
      );
    }

    res.json({ success: true, user: updatedUser });

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};