import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger-config';

function requestLogger(req: Request, res: Response, next: NextFunction): void {
    const startTime = Date.now();
    const { method, originalUrl } = req;

    logger.info({ method, url: originalUrl }, '[HTTP] Incoming request');

    res.on('finish', () => {
        const duration = Date.now() - startTime;
        const { statusCode } = res;

        if (statusCode >= 400) {
            logger.error(
                { method, url: originalUrl, statusCode, duration },
                '[HTTP] Request failed',
            );
        } else {
            logger.info(
                { method, url: originalUrl, statusCode, duration },
                '[HTTP] Request completed',
            );
        }
    });

    next();
}

export default requestLogger;
