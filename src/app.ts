import express, { Express, Request, Response } from 'express';
import serverConfig from './config/server-config';
import helmet from 'helmet';
import cors from 'cors';
import { globalRateLimiter } from './utils/rate-limiter';
import { StatusCodes } from 'http-status-codes';
import cookieParser from 'cookie-parser';

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

app.use(
    cors({
        origin: origins,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    }),
);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req: Request, res: Response): void => {
    res.set('Cache-Control', 'no-store');

    res.status(StatusCodes.OK).json({
        success: true,
        message: 'Server is up and running smoothly!',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});

app.use(globalRateLimiter);

export default app;
