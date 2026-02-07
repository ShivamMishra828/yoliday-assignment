import AuthRepository from '../repositories/auth-repository';
import AuthService from '../services/auth-service';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { SuccessResponse } from '../utils/responses';
import ServerConfig from '../config/server-config';

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

export async function signIn(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { email, password } = req.body;

        const { user, token } = await authService.signin({ email, password });

        res.cookie('token', token, {
            httpOnly: true,
            secure: ServerConfig.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000,
        })
            .status(StatusCodes.OK)
            .json(new SuccessResponse('User successfully logged in', { user, token }));
    } catch (err: unknown) {
        next(err);
    }
}

export async function signOut(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        res.clearCookie('token')
            .status(StatusCodes.OK)
            .json(new SuccessResponse('User successfully logged out', null));
    } catch (error) {
        next(error);
    }
}
