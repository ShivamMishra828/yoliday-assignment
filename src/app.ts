import express, { Express, Request, Response } from 'express';
import serverConfig from './config/server-config';
import helmet from 'helmet';
import cors from 'cors';
import { globalRateLimiter } from './utils/rate-limiter';
import { StatusCodes } from 'http-status-codes';
import cookieParser from 'cookie-parser';
import prisma from './config/prisma-client';
import globalErrorHandler from './middlewares/global-error-handler';
import apiRoutes from './routes';
import requestLogger from './middlewares/request-logger-middleware';

const app: Express = express();

if (serverConfig.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}

const origins =
    serverConfig.CORS_ORIGIN === '*'
        ? '*'
        : serverConfig.CORS_ORIGIN.split(',').map((o: string): string => o.trim());

app.use(helmet());
app.use(cookieParser());
app.use(requestLogger);

app.use(
    cors({
        origin: origins,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    }),
);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', async (_req: Request, res: Response): Promise<void> => {
    res.set('Cache-Control', 'no-store');

    try {
        await prisma.$queryRaw`SELECT 1`;

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Server and database are healthy',
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
            success: false,
            message: 'Database connection failed',
            timestamp: new Date().toISOString(),
        });
    }
});

app.use(globalRateLimiter);

app.use('/api', apiRoutes);

app.use(globalErrorHandler);

export default app;
