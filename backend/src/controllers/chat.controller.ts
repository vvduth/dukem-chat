import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import { getUsersService } from "../services/user.service";
import { createChatSchema } from "../validators/chat.validator";
import { createChatService } from "../services/chat.service";

export const createChatController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const body = createChatSchema.parse(req.body);

    const chat = await createChatService(userId, body);

    return res.status(HTTPSTATUS.OK).json({
      success: true,
      data: chat,
      message: "Chat created successfully",
    });
  }
);
