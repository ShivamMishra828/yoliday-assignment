import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ServerConfig from '../config/server-config';
import { User } from '@prisma/client';

export function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
}

export function comparePassword(inputPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(inputPassword, hashedPassword);
}

export function generateToken(userId: string, role: User['role']): string {
    return jwt.sign({ userId, role }, ServerConfig.JWT_SECRET, {
        expiresIn: '1d',
    });
}
