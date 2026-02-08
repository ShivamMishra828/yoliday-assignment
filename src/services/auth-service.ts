import AuthRepository from '../repositories/auth-repository';
import AppError from '../utils/app-error';
import { StatusCodes } from 'http-status-codes';
import { comparePassword, hashPassword, generateToken } from '../utils/helper';
import { User } from '@prisma/client';

interface UserSignUpInput {
    email: string;
    password: string;
    role: 'host' | 'user';
}

interface UserSignInInput {
    email: string;
    password: string;
}

interface UserSignInOutput {
    user: Omit<User, 'passwordHash'>;
    token: string;
}

class AuthService {
    private authRepository: AuthRepository;

    constructor(authRepository: AuthRepository) {
        this.authRepository = authRepository;
    }

    async signup(userData: UserSignUpInput): Promise<Omit<User, 'passwordHash'>> {
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
                throw new AppError(
                    'An unexpected server error occurred during signup',
                    StatusCodes.INTERNAL_SERVER_ERROR,
                    'INTERNAL_SERVER_ERROR',
                );
            }
        }
    }

    async signin(userData: UserSignInInput): Promise<UserSignInOutput> {
        try {
            const user = await this.authRepository.findByEmail(userData.email);

            if (!user) {
                throw new AppError(
                    'User with this email does not exist',
                    StatusCodes.NOT_FOUND,
                    'USER_NOT_FOUND',
                );
            }

            const isPasswordValid: boolean = await comparePassword(
                userData.password,
                user.passwordHash,
            );

            if (!isPasswordValid) {
                throw new AppError(
                    'Invalid credentials. Please check your email and password',
                    StatusCodes.UNAUTHORIZED,
                    'INVALID_CREDENTIALS',
                );
            }

            const token: string = generateToken(user.id, user.role);

            const { passwordHash: _, ...userWithoutPassword } = user;

            return { user: userWithoutPassword, token };
        } catch (err: unknown) {
            if (err instanceof AppError) {
                throw err;
            } else {
                throw new AppError(
                    'An unexpected server error occurred during signin',
                    StatusCodes.INTERNAL_SERVER_ERROR,
                    'INTERNAL_SERVER_ERROR',
                );
            }
        }
    }
}

export default AuthService;
