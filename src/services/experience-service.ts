import ExperienceRepository from '../repositories/experience-repository';
import { Experience, Prisma, Role } from '@prisma/client';
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

    async publishExperience(
        userId: string,
        experienceId: string,
        userRole: Role,
    ): Promise<Experience> {
        try {
            const experience = await this.experienceRepository.findById(experienceId);
            if (!experience) {
                throw new AppError(
                    'Experience not found',
                    StatusCodes.NOT_FOUND,
                    'EXPERIENCE_NOT_FOUND',
                );
            }

            if (experience.status === 'published') {
                throw new AppError(
                    'Experience is already published',
                    StatusCodes.CONFLICT,
                    'EXPERIENCE_ALREADY_PUBLISHED',
                );
            }

            const isAdmin: boolean = userRole === 'admin';
            const isOwner: boolean = experience.createdBy === userId;

            if (!isAdmin && !isOwner) {
                throw new AppError(
                    'You do not have permission to publish this experience',
                    StatusCodes.FORBIDDEN,
                    'FORBIDDEN',
                );
            }

            return this.experienceRepository.updateStatus(experienceId, 'published');
        } catch (err) {
            if (err instanceof AppError) {
                throw err;
            } else {
                throw new AppError(
                    'Failed to publish experience',
                    StatusCodes.INTERNAL_SERVER_ERROR,
                    'EXPERIENCE_UPDATE_FAILED',
                );
            }
        }
    }

    async blockExperience(experienceId: string, userRole: Role): Promise<Experience> {
        try {
            const experience = await this.experienceRepository.findById(experienceId);
            if (!experience) {
                throw new AppError(
                    'Experience not found',
                    StatusCodes.NOT_FOUND,
                    'EXPERIENCE_NOT_FOUND',
                );
            }

            if (experience.status === 'blocked') {
                throw new AppError(
                    'Experience is already blocked',
                    StatusCodes.CONFLICT,
                    'EXPERIENCE_ALREADY_BLOCKED',
                );
            }

            const isAdmin: boolean = userRole === 'admin';

            if (!isAdmin) {
                throw new AppError(
                    'Only admins can block experiences',
                    StatusCodes.FORBIDDEN,
                    'FORBIDDEN',
                );
            }

            return this.experienceRepository.updateStatus(experienceId, 'blocked');
        } catch (err) {
            if (err instanceof AppError) {
                throw err;
            } else {
                throw new AppError(
                    'Failed to block experience',
                    StatusCodes.INTERNAL_SERVER_ERROR,
                    'EXPERIENCE_UPDATE_FAILED',
                );
            }
        }
    }

    async findAllExperience(query: {
        location?: string;
        from?: string;
        to?: string;
        page: number;
        limit: number;
        sort: 'asc' | 'desc';
    }): Promise<Experience[]> {
        try {
            const filters: Prisma.ExperienceWhereInput = {};

            if (query.location) {
                filters.location = {
                    contains: query.location,
                    mode: 'insensitive',
                };
            }

            if (query.from || query.to) {
                filters.startTime = {};
                if (query.from) {
                    filters.startTime.gte = new Date(`${query.from}T00:00:00.000Z`);
                }
                if (query.to) {
                    filters.startTime.lte = new Date(`${query.to}T23:59:59.999Z`);
                }
            }

            const skip: number = (query.page - 1) * query.limit;

            return await this.experienceRepository.findAll(filters, {
                skip,
                take: query.limit,
                orderBy: {
                    startTime: query.sort,
                },
            });
        } catch (err: unknown) {
            throw new AppError(
                'Failed to find experiences',
                StatusCodes.INTERNAL_SERVER_ERROR,
                'INTERNAL_SERVER_ERROR',
            );
        }
    }
}

export default ExperienceService;
