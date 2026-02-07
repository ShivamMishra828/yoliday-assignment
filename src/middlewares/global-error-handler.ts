import { NextFunction, Request, Response } from 'express';
import logger from '../config/logger-config';
import AppError from '../utils/app-error';
import { ErrorResponse } from '../utils/responses';

function globalErrorHandler(err: Error, req: Request, res: Response, _next: NextFunction): void {
    if (err instanceof AppError) {
        logger.warn({ err }, '[GLOBAL_ERROR] Operational error');

        res.status(err.statusCode).json(new ErrorResponse(err.code, err.message, err.details));
        return;
    }

    logger.error(
        {
            err,
            path: req.originalUrl,
            method: req.method,
        },
        '[GLOBAL_ERROR] Unexpected error',
    );

    res.status(500).json(new ErrorResponse('INTERNAL_SERVER_ERROR', err.message, []));
}

export default globalErrorHandler;
