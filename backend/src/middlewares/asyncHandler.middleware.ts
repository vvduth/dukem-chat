
import { NextFunction, Request, Response } from "express";

type AsyncController = (
    req:Request,
    res: Response,
    next: NextFunction
) =>  Promise<void>;