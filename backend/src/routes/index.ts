import { Router } from "express";
import authRoutes from "./auth.route";

const router = Router();
router.use("/auth", authRoutes);
// chta 

// user

export default router;