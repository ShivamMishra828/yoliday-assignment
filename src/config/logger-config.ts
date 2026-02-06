import pino from 'pino';
import serverConfig from './server-config';

const isProduction: boolean = serverConfig.NODE_ENV === 'production';

const logger = pino(
    {
        level: serverConfig.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
        timestamp: pino.stdTimeFunctions.isoTime,
        redact: {
            paths: ['req.headers.authorization', 'req.body.password', 'req.body.token'],
            censor: '[REDACTED]',
        },
    },
    isProduction
        ? undefined
        : pino.transport({
              target: 'pino-pretty',
              options: {
                  colorize: true,
                  ignore: 'pid,hostname',
                  singleLine: true,
              },
          }),
);

export default logger;
