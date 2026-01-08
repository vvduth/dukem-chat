import { Router } from "express";
import { createChatController, getSignleChatController, getUserChatsController } from "../controllers/chat.controller";
import { passportAuthenticateJwt } from "../config/passport.config";

 const chatRoutes = Router()
.use(passportAuthenticateJwt)
.post("/create", createChatController)
.get("/all", getUserChatsController)
.get("/:id", getSignleChatController)
.get("/status", passportAuthenticateJwt);

export default chatRoutes;