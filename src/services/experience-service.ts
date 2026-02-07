import ExperienceRepository from '../repositories/experience-repository';
import { Experience } from '@prisma/client';
import AppError from '../utils/app-error';
import { StatusCodes } from 'http-status-codes';

interface ExperienceCreateInput {
    title: string;
    description: string;
    location: string;
    price: number;
    startTime: Date;
}

class ExperienceService {
    private experienceRepository: ExperienceRepository;

    constructor(experienceRepository: ExperienceRepository) {
        this.experienceRepository = experienceRepository;
    }

    async create(experienceData: ExperienceCreateInput, userId: string): Promise<Experience> {
        try {
            return await this.experienceRepository.create({
                title: experienceData.title,
                description: experienceData.description,
                location: experienceData.location,
                price: experienceData.price,
                startTime: experienceData.startTime,
                creator: {
                    connect: { id: userId },
                },
            });
        } catch (err: unknown) {
            throw new AppError(
                'Failed to create experience',
                StatusCodes.INTERNAL_SERVER_ERROR,
                'EXPERIENCE_CREATION_FAILED',
            );
        }
    }
}

export default ExperienceService;
