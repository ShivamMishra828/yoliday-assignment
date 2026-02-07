import { Prisma, Experience } from '@prisma/client';
import prisma from '../config/prisma-client';

class ExperienceRepository {
    create(data: Prisma.ExperienceCreateInput): Promise<Experience> {
        return prisma.experience.create({ data });
    }
}

export default ExperienceRepository;
