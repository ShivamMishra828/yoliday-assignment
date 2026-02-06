import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';
import serverConfig from '../config/server-config';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const retryAfterMinutes: number = Math.ceil(serverConfig.RATE_LIMIT_WINDOW_MS / 60000);

const rateLimitHandler = (_req: Request, res: Response): void => {
    res.status(StatusCodes.TOO_MANY_REQUESTS).json({
        error: 'Too many requests',
        message: `You have exceeded the rate limit. Please try again after ${retryAfterMinutes} minutes.`,
    });
};

export const globalRateLimiter: RateLimitRequestHandler = rateLimit({
    windowMs: serverConfig.RATE_LIMIT_WINDOW_MS,
    limit: serverConfig.RATE_LIMIT_GLOBAL_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req: Request): boolean => req.path.startsWith('/health'),
    handler: rateLimitHandler,
});

export const authRateLimiter: RateLimitRequestHandler = rateLimit({
    windowMs: serverConfig.RATE_LIMIT_WINDOW_MS,
    limit: serverConfig.RATE_LIMIT_AUTH_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    handler: rateLimitHandler,
});
