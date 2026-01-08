import { Router } from "express";
import authRoutes from "./auth.route";
import chatRoutes from "./chat.route";
import userRoutes from "./user.route";
const router = Router();
router.use("/auth", authRoutes);
// chat 
router.use("/chat", chatRoutes);
// user
router.use("/user", userRoutes);

export default router;