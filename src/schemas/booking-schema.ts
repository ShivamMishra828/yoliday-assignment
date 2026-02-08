import { z } from 'zod/v3';

export const bookExperienceBodySchema = z.object({
    seats: z.number().int('Seats must be an integer').min(1, 'At least one seat must be booked'),
});
