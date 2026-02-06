import http from 'http';
import serverConfig from './config/server-config';
import app from './app';
import logger from './config/logger-config';
import prisma from './config/prisma-client';

let server: http.Server | null = null;

const port: number = serverConfig.PORT;
const env = serverConfig.NODE_ENV;

async function startServer(): Promise<void> {
    try {
        await prisma.$connect();
        logger.info('[SERVER] Prisma client successfully connected to the database.');
    } catch (err: unknown) {
        logger.fatal({ err }, '[SERVER] Failed to connect to database. Shutting down');
        process.exit(1);
    }

    server = http.createServer(app);

    server.on('error', (err: Error): void => {
        logger.error({ err }, '[SERVER] HTTP server error');
        process.exit(1);
    });

    server.listen(port, (): void => {
        logger.info({ port, env }, '[SERVER] HTTP server listening');
    });
}

async function stopServer(signal?: string): Promise<void> {
    logger.info({ signal: signal ?? 'unknown' }, '[SERVER] Shutdown initiated');

    try {
        await prisma.$disconnect();
        logger.info('[SERVER] Database connection closed');
    } catch (err: unknown) {
        logger.error({ err }, '[SERVER] Error while disconnecting database');
    }

    if (!server) {
        logger.warn('[SERVER] Shutdown requested before initialization');
        return process.exit(0);
    }

    const shutdownTimer = setTimeout((): void => {
        logger.error('[SERVER] Forced shutdown after timeout');
        process.exit(1);
    }, 10000);

    shutdownTimer.unref();

    server.close((err): void => {
        if (err) {
            logger.error({ err }, '[SERVER] Error during shutdown');
            process.exit(1);
        }

        logger.info('[SERVER] HTTP server shut down gracefully');
        process.exit(0);
    });
}

process.on('SIGINT', stopServer);
process.on('SIGTERM', stopServer);

process.on('uncaughtException', (err: Error): void => {
    logger.fatal({ err }, '[FATAL] Uncaught exception');
    process.exit(1);
});

process.on('unhandledRejection', (reason): void => {
    logger.fatal({ err: reason }, '[FATAL] Unhandled promise rejection');
    process.exit(1);
});

startServer().catch((err: Error): void => {
    logger.fatal({ err }, '[SERVER] Startup failure');
    process.exit(1);
});
