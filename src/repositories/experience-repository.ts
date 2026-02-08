import { Prisma, Experience, ExperienceStatus } from '@prisma/client';
import prisma from '../config/prisma-client';

class ExperienceRepository {
    create(data: Prisma.ExperienceCreateInput): Promise<Experience> {
        return prisma.experience.create({ data });
    }

    findById(id: string): Promise<Experience | null> {
        return prisma.experience.findUnique({ where: { id } });
    }

    updateStatus(id: string, status: ExperienceStatus): Promise<Experience> {
        return prisma.experience.update({ where: { id }, data: { status } });
    }

    findAll(
        filters: Prisma.ExperienceWhereInput,
        options: {
            skip: number;
            take: number;
            orderBy: Prisma.ExperienceOrderByWithRelationInput;
        },
    ): Promise<Experience[]> {
        return prisma.experience.findMany({
            where: {
                status: ExperienceStatus.published,
                ...filters,
            },
            skip: options.skip,
            take: options.take,
            orderBy: options.orderBy,
        });
    }
}

export default ExperienceRepository;
