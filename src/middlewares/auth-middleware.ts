import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/app-error';
import { StatusCodes } from 'http-status-codes';
import jwt, { JwtPayload } from 'jsonwebtoken';
import ServerConfig from '../config/server-config';

interface AuthPayload extends JwtPayload {
    userId: string;
    role: 'user' | 'host' | 'admin';
}

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                role: 'user' | 'host' | 'admin';
            };
        }
    }
}

async function verifyJwtToken(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const token: string = req.cookies?.token;

    if (!token) {
        return next(
            new AppError(
                'Authentication token is missing',
                StatusCodes.UNAUTHORIZED,
                'TOKEN_NOT_FOUND',
            ),
        );
    }

    try {
        const decoded = jwt.verify(token, ServerConfig.JWT_SECRET) as AuthPayload;

        req.user = {
            id: decoded.userId,
            role: decoded.role,
        };

        next();
    } catch (err: any) {
        if (err.name === 'JsonWebTokenError') {
            return next(
                new AppError(
                    'Invalid authentication token',
                    StatusCodes.UNAUTHORIZED,
                    'INVALID_JWT_TOKEN',
                ),
            );
        } else if (err.name === 'TokenExpiredError') {
            return next(
                new AppError(
                    'Authentication token has expired',
                    StatusCodes.UNAUTHORIZED,
                    'TOKEN_EXPIRED',
                ),
            );
        } else {
            return next(
                new AppError(
                    'Authentication failed due to server error',
                    StatusCodes.INTERNAL_SERVER_ERROR,
                    'INTERNAL_SERVER_ERROR',
                ),
            );
        }
    }
}

export default verifyJwtToken;
