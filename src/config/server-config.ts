import dotenv from 'dotenv';
import { cleanEnv, num, port, str, url } from 'envalid';

if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

const serverConfig = Object.freeze(
    cleanEnv(process.env, {
        PORT: port({ default: 3000 }),
        RATE_LIMIT_WINDOW_MS: num({ default: 10 * 60 * 1000 }),
        RATE_LIMIT_GLOBAL_MAX: num({ default: 20 }),
        RATE_LIMIT_AUTH_MAX: num({ default: 5 }),
        CORS_ORIGIN: str({ default: 'http://localhost:3000' }),
        DATABASE_URL: url(),
        LOG_LEVEL: str({
            choices: ['info', 'warn', 'error', 'debug', 'fatal', 'trace'],
            default: 'info',
        }),
        NODE_ENV: str({
            choices: ['production', 'development', 'test'],
            default: 'development',
        }),
        JWT_SECRET: str(),
    }),
);

export default serverConfig;
