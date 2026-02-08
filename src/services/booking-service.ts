import BookingRepository from '../repositories/booking-repository';
import ExperienceRepository from '../repositories/experience-repository';
import { Booking, ExperienceStatus } from '@prisma/client';
import AppError from '../utils/app-error';
import { StatusCodes } from 'http-status-codes';

class BookingService {
    private bookingRepository: BookingRepository;
    private experienceRepository: ExperienceRepository;

    constructor(bookingRepository: BookingRepository, experienceRepository: ExperienceRepository) {
        this.bookingRepository = bookingRepository;
        this.experienceRepository = experienceRepository;
    }

    async bookExperience(experienceId: string, userId: string, seats: number): Promise<Booking> {
        try {
            const experience = await this.experienceRepository.findById(experienceId);

            if (!experience) {
                throw new AppError(
                    'Experience not found',
                    StatusCodes.NOT_FOUND,
                    'EXPERIENCE_NOT_FOUND',
                );
            }

            if (experience.status !== ExperienceStatus.published) {
                throw new AppError(
                    'Cannot book an unpublished experience',
                    StatusCodes.BAD_REQUEST,
                    'EXPERIENCE_NOT_PUBLISHED',
                );
            }

            if (experience.createdBy === userId) {
                throw new AppError(
                    'Hosts cannot book their own experiences',
                    StatusCodes.FORBIDDEN,
                    'HOST_SELF_BOOKING_NOT_ALLOWED',
                );
            }

            const existingBooking = await this.bookingRepository.findConfirmedBookingByUser(
                userId,
                experienceId,
            );

            if (existingBooking) {
                throw new AppError(
                    'You have already booked this experience',
                    StatusCodes.CONFLICT,
                    'DUPLICATE_BOOKING',
                );
            }

            return await this.bookingRepository.create({
                seats,
                user: {
                    connect: { id: userId },
                },
                experience: {
                    connect: { id: experienceId },
                },
            });
        } catch (err: unknown) {
            if (err instanceof AppError) {
                throw err;
            } else {
                throw new AppError(
                    'Failed to create booking',
                    StatusCodes.INTERNAL_SERVER_ERROR,
                    'BOOKING_CREATION_FAILED',
                );
            }
        }
    }
}

export default BookingService;
