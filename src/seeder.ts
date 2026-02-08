import prisma from './config/prisma-client';
import { hashPassword } from './utils/helper';
import { Role } from '@prisma/client';
import logger from './config/logger-config';

const ADMIN_EMAIL = 'admin@yoliday.com';
const ADMIN_PASSWORD = 'password123';

async function seed(): Promise<void> {
    logger.info('[SEED] Starting database seeding...');

    try {
        const existingAdmin = await prisma.user.findUnique({
            where: { email: ADMIN_EMAIL },
        });

        if (existingAdmin) {
            logger.info('[SEED] Admin user already exists. Skipping creation.');
            return;
        }

        const passwordHash: string = await hashPassword(ADMIN_PASSWORD);

        const admin = await prisma.user.create({
            data: {
                email: ADMIN_EMAIL,
                passwordHash,
                role: Role.admin,
            },
        });

        logger.info({ adminId: admin.id }, '[SEED] Admin user created successfully.');
    } catch (error) {
        logger.error({ err: error }, '[SEED] Failed to seed database.');
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

seed();
