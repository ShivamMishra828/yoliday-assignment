import ExperienceRepository from '../repositories/experience-repository';
import ExperienceService from '../services/experience-service';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { SuccessResponse } from '../utils/responses';

const experienceRepository = new ExperienceRepository();
const experienceService = new ExperienceService(experienceRepository);

export async function createExperience(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    try {
        const experience = await experienceService.create(req.body, req.user!.id);

        res.status(StatusCodes.CREATED).json(
            new SuccessResponse('Experience created successfully', experience),
        );
    } catch (err: unknown) {
        next(err);
    }
}
