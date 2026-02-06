import http from 'http';
import serverConfig from './config/server-config';
import app from './app';
import logger from './config/logger-config';

let server: http.Server | null = null;

const port: number = serverConfig.PORT;
const env = serverConfig.NODE_ENV;

async function startServer(): Promise<void> {
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
    logger.info(`[SERVER] Shutdown initiated. Signal: ${signal ?? 'unknown'}`);

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
