import { NextFunction, Request, Response } from "express";
import { ErrorRequestHandler } from "express";
import { HTTPSTATUS } from "../config/http.config";
import { AppError, ErrorCodes } from "../utils/app-error";
export const errorHandler : ErrorRequestHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction

): any =>{
    console.log(`Error: ${req.path} `, err);

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            message: err.message,
            errorCode: err.errorCode
        });

    }

    return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
        error: err?.message || "Some error occurred",
        message: "Internal Server Error",
        errorCode: ErrorCodes.ERR_INTERNAL
    });
}