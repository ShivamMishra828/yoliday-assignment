import prisma from '../config/prisma-client';
import { Prisma, User } from '@prisma/client';

class AuthRepository {
    findByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({ where: { email } });
    }

    create(userData: Prisma.UserCreateInput): Promise<User> {
        return prisma.user.create({
            data: userData,
        });
    }
}

export default AuthRepository;
