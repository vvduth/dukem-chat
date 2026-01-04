import { HTTPSTATUS, HttpStatusCodeType } from "../config/http.config";

export const ErrorCodes = {
    ERR_INTERNAL: 'ERR_INTERNAL',
    ERR_NOT_FOUND: 'ERR_NOT_FOUND',
    ERR_BAD_REQUEST: 'ERR_BAD_REQUEST',
    ERR_UNAUTHORIZED: 'ERR_UNAUTHORIZED',
    ERR_FORBIDDEN: 'ERR_FORBIDDEN',
} as const ;

export type ErrorCodeType = keyof typeof ErrorCodes;    
export class AppError extends Error {
    constructor(
        message: string,
        public statusCode: HttpStatusCodeType = HTTPSTATUS.INTERNAL_SERVER_ERROR,
        public errorCode: keyof typeof ErrorCodes = ErrorCodes.ERR_INTERNAL
    ) {
        super(message);
        Error.captureStackTrace(this);
    }
}

export class InternalServerError extends AppError {
    constructor(message: string = 'Internal Server Error') {
        super(message, HTTPSTATUS.INTERNAL_SERVER_ERROR, ErrorCodes.ERR_INTERNAL);
    }
}