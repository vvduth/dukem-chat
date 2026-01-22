import "dotenv/config";
import express, { Application, Request,Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "passport";
import { Env } from "./config/env.config";
import { asyncHandler } from "./middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "./config/http.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import connectDatabase from "./config/database.config";
import "./config/passport.config";
import router from "./routes";
import http from "http";
import { initializeSocket } from "./lib/socket";

const app = express();
const server = http.createServer(app);

// initialize socket for real-time features 
initializeSocket(server);

app.use(express.json(
 {limit: "10mb"}
));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: Env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(passport.initialize());

app.get("/health", asyncHandler(async (req: Request, res: Response) => {
    res.status(HTTPSTATUS.OK).json({ status: "OK" });
}));
app.use("/api", router)

app.use(errorHandler)
app.listen(Env.PORT, async () => {
    await connectDatabase();
    console.log(`Server is running on port ${Env.PORT} in ${Env.NODE_ENV} mode`);
})
