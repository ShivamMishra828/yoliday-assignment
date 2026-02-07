import { z } from 'zod/v3';
import { ExperienceStatus } from '@prisma/client';

export const createExperienceSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters long'),
    description: z.string().min(10, 'Description must be at least 10 characters long'),
    location: z.string().min(3, 'Location must be at least 3 characters long'),
    price: z.number().int('Price must be an integer').positive('Price must be greater than zero'),
    startTime: z.string().datetime({ message: 'Invalid start time format' }),
});

export const updateExperienceStatusSchema = z.object({
    status: z.nativeEnum(ExperienceStatus),
});

export const experienceIdParamSchema = z.object({
    id: z.string().uuid('Invalid experience id'),
});
