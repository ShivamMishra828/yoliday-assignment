import AuthRepository from '../repositories/auth-repository';
import AuthService from '../services/auth-service';
import { NextFunction, Request, Response } from 'express';
import logger from '../config/logger-config';
import { StatusCodes } from 'http-status-codes';
import { SuccessResponse } from '../utils/responses';

const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);

export async function signUp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { email, password, role } = req.body;

        const user = await authService.signup({ email, password, role });

        res.status(StatusCodes.CREATED).json(
            new SuccessResponse('User successfully created', user),
        );
    } catch (err: unknown) {
        next(err);
    }
}
