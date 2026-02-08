import { z } from 'zod/v3';

export const createExperienceSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters long'),
    description: z.string().min(10, 'Description must be at least 10 characters long'),
    location: z.string().min(3, 'Location must be at least 3 characters long'),
    price: z.number().int('Price must be an integer').positive('Price must be greater than zero'),
    startTime: z.string().datetime({ message: 'Invalid start time format' }),
});

export const experienceIdParamSchema = z.object({
    id: z.string().uuid('Invalid experience id'),
});

export const listExperiencesQuerySchema = z.object({
    location: z.string().optional(),
    from: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format must be YYYY-MM-DD')
        .optional(),
    to: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format must be YYYY-MM-DD')
        .optional(),
    page: z
        .string()
        .transform((v) => Number(v))
        .refine((v) => v > 0, 'Page must be greater than 0')
        .default('1'),
    limit: z
        .string()
        .transform((v) => Number(v))
        .refine((v) => v > 0 && v <= 100, 'Limit must be between 1 and 100')
        .default('10'),
    sort: z.enum(['asc', 'desc']).default('asc'),
});
