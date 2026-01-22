import { Server as HttpServer } from "http";
import { type Socket, Server as SocketIOServer } from "socket.io";
import { Env } from "../config/env.config";
import jwt from "jsonwebtoken";
import { ca } from "zod/v4/locales";
import { validateChatParticipant } from "../services/chat.service";

// Socket.IO server instance
let io: SocketIOServer | null = null;

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

const onlineUsers: Map<string, string> = new Map(); // Map<userId, socketId>

export const initializeSocket = (server: HttpServer) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: Env.FRONTEND_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // middleware for socket authentication, only ppl with cookies can connect
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      // extract cookie from socket handshake headers
      const rawCookie = socket.handshake.headers.cookie;

      if (!rawCookie) {
        return next(new Error("Authentication error: No cookie provided"));
      }

      const token = rawCookie?.split("=")?.[1]?.trim();
      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }

      const decodedToken = jwt.verify(token, Env.JWT_SECRET) as {
        userId: string;
      };
      if (!decodedToken) {
        return next(new Error("Authentication error: Invalid token"));
      }

      socket.userId = decodedToken.userId;
      next();
    } catch (error) {
      next(new Error("Internal server error during authentication"));
    }
  });

  // handle socket connections
  io.on("connection", (socket: AuthenticatedSocket) => {
    if (!socket.userId) {
      socket.disconnect(true);
      return;
    }

    const userId = socket.userId!;

    // You can now use userId to manage user-specific socket events
    const newSocketId = socket.id;
    console.log(`User connected: ${userId} with socket ID: ${newSocketId}`);

    // register socket for online user
    onlineUsers.set(userId, newSocketId);

    // emit updated online users to all connected clients
    io?.emit("online:users", Array.from(onlineUsers.keys()));

    // create a  personal room for the user
    socket.join(`user:${userId}`);

    // handle join chat room event
    socket.on("chat:join", async (
        chatId: string, 
        callback?: (err?: string) => void
    ) => {
        try {
            // join the chat room
            await validateChatParticipant(chatId, userId);
            socket.join(`chat:${chatId}`);
            callback?.();
        } catch (error) {
            callback?.("Failed to join chat room");
        }
    })

    // handle chat leave event
    socket.on("chat:leave", (chatId: string) => {
        if (chatId) {
            socket.leave(`chat:${chatId}`);
            console.log(`User ${userId} left chat room: ${chatId}`);
        }
    })

    // handle socket disconnection aka user goes offline
    socket.on("disconnect", () => {
        if (onlineUsers.get(userId) === newSocketId) {
            if (userId) {
                onlineUsers.delete(userId);
            }

            // emit updated online users to all connected clients
            io?.emit("online:users", Array.from(onlineUsers.keys()));
            console.log(`User go offline: ${userId}`);
        }
    })
  });
};

function getIOInstance(): SocketIOServer {
    if (!io) {
        throw new Error("Socket.IO not initialized");
    }
    return io;
}


export const emitNewChatToParticipants = (
  participantIds: string[] =[],
  chat: any
) => {
    const io = getIOInstance();
    for (const participantId of participantIds) {
        // emit to each participant's personal room
        io.to(`user:${participantId}`).emit("chat:new", chat);
    }
}

export const emitNewMessageToChatRoom = (
    userId: string,
    chatId: string,
    newMessage: any
) => {
    const io = getIOInstance();
    const senderSocketId = onlineUsers.get(userId);

    if (senderSocketId) {
        io.to(`chat:${chatId}`).except(senderSocketId).emit("message:new", newMessage);
    } else {
        io.to(`chat:${chatId}`).emit("message:new", newMessage);
    }
}

export const emitLastMessageToChatParticipants = (
    participantIds: string[] = [],
    chatId: string, 
    lastMessage: any
) => {
    const io = getIOInstance();
    const payload = {chatId, lastMessage};

    for (const participantId of participantIds) {
        io.to(`user:${participantId}`).emit("chat:update", payload);
    }
}