import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/app-error';
import { StatusCodes } from 'http-status-codes';

type Role = 'admin' | 'host' | 'user';

function requireRoles(allowedRoles: Role[]) {
    return (req: Request, _res: Response, next: NextFunction): void => {
        if (!req.user) {
            return next(
                new AppError('Authentication required', StatusCodes.UNAUTHORIZED, 'UNAUTHORIZED'),
            );
        }

        if (!allowedRoles.includes(req.user.role)) {
            return next(
                new AppError(
                    'You do not have permission to perform this action',
                    StatusCodes.FORBIDDEN,
                    'FORBIDDEN',
                ),
            );
        }

        next();
    };
}

export default requireRoles;
