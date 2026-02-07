import { ZodSchema, ZodError, ZodIssue } from 'zod/v3';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import AppError from '../utils/app-error';

type ValidationTarget = keyof Pick<Request, 'body' | 'params' | 'query'>;

const validate =
    (schema: ZodSchema, target: ValidationTarget = 'body'): RequestHandler =>
    async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
        try {
            await schema.parseAsync(req[target]);
            next();
        } catch (err: unknown) {
            if (err instanceof ZodError) {
                const details = err.errors.map((issue: ZodIssue) => ({
                    field: issue.path.join('.'),
                    message: issue.message,
                }));

                return next(
                    new AppError(
                        'Validation failed',
                        StatusCodes.BAD_REQUEST,
                        'VALIDATION_ERROR',
                        details,
                    ),
                );
            }
            return next(
                new AppError(
                    'An unexpected server error occurred during request validation',
                    StatusCodes.INTERNAL_SERVER_ERROR,
                    'INTERNAL_SERVER_ERROR',
                ),
            );
        }
    };

export default validate;
