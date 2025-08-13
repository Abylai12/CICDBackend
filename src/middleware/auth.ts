import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/generate-token";

declare global {
  namespace Express {
    interface Request {
      user: string | any;
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // Attach userId to request object
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
};
