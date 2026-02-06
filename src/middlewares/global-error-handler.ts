import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import logger from '../config/logger-config';
import AppError from '../utils/app-error';
import { ErrorResponse } from '../utils/responses';

function globalErrorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
    logger.error({ err, stack: err.stack }, '[Global Error] Request failed');

    if (err instanceof AppError) {
        res.status(err.statusCode).json(new ErrorResponse(err.code, err.message, err.details));
        return;
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        new ErrorResponse(
            'INTERNAL_SERVER_ERROR',
            'An unexpected internal server error occurred',
            [],
        ),
    );
    return;
}

export default globalErrorHandler;
