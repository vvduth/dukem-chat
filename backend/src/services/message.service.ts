import ChatModel from "../models/chat.model";
import MessageModel from "../models/message.model";
import { BadRequestException, NotFoundException } from "../utils/app-error";
import cloudinary from "../config/cloudinary.config";
import mongoose from "mongoose";
import { emitLastMessageToChatParticipants, emitNewMessageToChatRoom } from "../lib/socket";

export const sendMessageService = async (
  userId: string,
  body: {
    chatId: string;
    content?: string;
    image?: string;
    replyToId?: string;
  },
) => {
  const { chatId, content, image, replyToId } = body;
  const chat = await ChatModel.findOne({
    _id: chatId,
    participants: {
      $in: [userId],
    },
  });
  if (!chat)
    throw new BadRequestException("Chat not found or user not a participant");

  if (replyToId) {
    const replyMessage = await MessageModel.findOne({
      _id: replyToId,
      chatId: chatId,
    });

    if (!replyMessage)
      throw new NotFoundException("Reply message not found in this chat");

    let imageUrl;
    if (image) {
      // upload the image to cloudinary or any other service
      const uploadRes = await cloudinary.uploader.upload(image);
      imageUrl = uploadRes.secure_url;
    }

    const newMessage = await MessageModel.create({
      chatId,
      sender: userId,
      content,
      image: imageUrl,
      replyTo: replyToId || null,
    });

    await newMessage.populate([
      { path: "sender", select: " name avatar" },
      {
        path: "replyTo",
        select: "content image sender",
        populate: {
          path: "sender",
          select: "name avatar",
        },
      },
    ]);

    chat.lastMessage = newMessage._id as mongoose.Types.ObjectId;
    await chat.save(); 

    // websocket emit new messages to chat room
    emitNewMessageToChatRoom(userId, chatId, newMessage);

    // web socket emit last message to members in the chat
    const allParticipantIds = chat.participants.map((id) => id.toString());
    emitLastMessageToChatParticipants(allParticipantIds, chatId, newMessage);

    return {
        userMessage: newMessage,
        chat
    }
  }
};
