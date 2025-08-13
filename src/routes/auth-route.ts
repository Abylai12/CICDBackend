import { Router } from "express";

import { signUp, signIn, getUserProfile } from "../controllers/auth-controller";
import { authMiddleware } from "../middleware/auth";
const router = Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/profile", authMiddleware, getUserProfile);

export default router;
