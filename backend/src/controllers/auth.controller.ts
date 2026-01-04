import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { loginSchema, registerSchema } from "../validators/auth.validator";
import { loginService, registerService } from "../services/auth.service";
import { setJwtAuthCookie } from "../utils/cookies";
import { HTTPSTATUS } from "../config/http.config";
export const registerController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = registerSchema.parse(req.body);
    const user = await registerService(body);
    const userId = user._id.toString();

    return setJwtAuthCookie({
      res,
      userId,
    })
      .status(HTTPSTATUS.CREATED)
      .json({
        message: "User registered successfully",
        user,
      });
  }
);
export const loginController = asyncHandler(
    async (req: Request, res: Response) => {
        const body = loginSchema.parse(req.body);

        const user = await loginService(body);
        const userId = user._id as unknown as string;
        return setJwtAuthCookie({
            res,
            userId,
        })
        .status(HTTPSTATUS.OK)
        .json({
            message: "User logged in successfully",
            user,
        });
    }
)