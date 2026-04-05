import jwt from "jsonwebtoken";

// Generate JWT token
export const generateToken = (userId) => {
  const token =  jwt.sign({ userId }, process.env.JWT_SECRET);
  return token;
}