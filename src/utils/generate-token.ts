import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateToken = (userId: string) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.ACCESS_TOKEN_SECRET || "",
    {
      expiresIn: "15m",
    }
  );

  return accessToken;
};

export const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "");
    console.log("Decoded token:", decoded);
    return decoded;
  } catch (error) {
    throw new Error("Invalid token");
  }
};
