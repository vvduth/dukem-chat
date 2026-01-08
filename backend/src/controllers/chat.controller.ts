import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import { chatIdSchema, createChatSchema } from "../validators/chat.validator";
import { createChatService, getSingleChatService, getUserChatsService } from "../services/chat.service";

export const createChatController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const body = createChatSchema.parse(req.body);

    const chat = await createChatService(userId, body);

    return res.status(HTTPSTATUS.OK).json({
      chat,
      message: "Chat created successfully",
    });
  }
);


export const getUserChatsController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const chats = await getUserChatsService(userId);

    return res.status(HTTPSTATUS.OK).json({
      messages: "User chats fetched successfully",
      chats,
    });
  }
)

export const getSignleChatController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { id } = chatIdSchema.parse(req.params);

    const {
      chat, messages
    } = await getSingleChatService(id, userId);

    return res.status(HTTPSTATUS.OK).json({
      message: "User Single chat fetched successfully",
      chat,
      messages
    })
  }
)
