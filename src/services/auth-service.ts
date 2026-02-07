import AuthRepository from '../repositories/auth-repository';
import AppError from '../utils/app-error';
import logger from '../config/logger-config';
import { StatusCodes } from 'http-status-codes';
import { hashPassword } from '../utils/helper';

interface UserInput {
    email: string;
    password: string;
    role: 'host' | 'user';
}

class AuthService {
    private authRepository: AuthRepository;

    constructor(authRepository: AuthRepository) {
        this.authRepository = authRepository;
    }

    async signup(userData: UserInput) {
        try {
            const existingUser = await this.authRepository.findByEmail(userData.email);

            if (existingUser) {
                throw new AppError(
                    'User with this email already exists',
                    StatusCodes.CONFLICT,
                    'USER_ALREADY_EXISTS',
                );
            }

            const passwordHash: string = await hashPassword(userData.password);

            const userToCreate = {
                email: userData.email,
                passwordHash,
                role: userData.role,
            };

            const user = await this.authRepository.create(userToCreate);

            const { passwordHash: _, ...userWithoutPassword } = user;

            return userWithoutPassword;
        } catch (err: unknown) {
            if (err instanceof AppError) {
                throw err;
            } else {
                logger.error({ err }, '[AUTH_SERVICE] Unexpected error during signup');
                throw new AppError(
                    'An unexpected server error occurred during signup.',
                    StatusCodes.INTERNAL_SERVER_ERROR,
                    'INTERNAL_SERVER_ERROR',
                );
            }
        }
    }
}

export default AuthService;
