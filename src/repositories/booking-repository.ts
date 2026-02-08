import { Prisma, Booking, BookingStatus } from '@prisma/client';
import prisma from '../config/prisma-client';

class BookingRepository {
    create(data: Prisma.BookingCreateInput): Promise<Booking> {
        return prisma.booking.create({ data });
    }

    findConfirmedBookingByUser(userId: string, experienceId: string): Promise<Booking | null> {
        return prisma.booking.findFirst({
            where: {
                userId,
                experienceId,
                status: BookingStatus.confirmed,
            },
        });
    }
}

export default BookingRepository;
