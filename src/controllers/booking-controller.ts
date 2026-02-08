import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { SuccessResponse } from '../utils/responses';
import BookingRepository from '../repositories/booking-repository';
import ExperienceRepository from '../repositories/experience-repository';
import BookingService from '../services/booking-service';

const bookingService = new BookingService(new BookingRepository(), new ExperienceRepository());

export async function bookExperience(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    try {
        const experienceId = req.params.id as string;
        const { seats } = req.body;
        const userId = req.user!.id;

        const booking = await bookingService.bookExperience(experienceId, userId, seats);

        res.status(StatusCodes.CREATED).json(
            new SuccessResponse('Experience booked successfully', booking),
        );
    } catch (err) {
        next(err);
    }
}
