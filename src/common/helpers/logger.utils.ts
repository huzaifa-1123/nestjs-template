import { Request, Response, RequestHandler } from 'express';
import { isDevelopment, LOG_LEVEL } from '../config/constant';
import { v4 as uuidv4 } from 'uuid';
import pino from 'pino';

export const getOrigin = (req: Request): string =>
  req.headers.origin || req.headers['user-agent'] || req.headers.referer || 'N/A';

/**
 * this functions is the reason that log is beautify in development and production is json
 */
export const buildTransportTargets = () => [
  {
    // this is for console
    target: isDevelopment ? 'pino-pretty' : 'pino/file',
    level: LOG_LEVEL,
    options: isDevelopment
      ? {
          colorize: true,
          translateTime: 'yyyy-mm-dd HH:MM:ss',
          ignore: 'pid,hostname,context,req,res,responseTime',
          messageFormat: '[{context}] {msg}',
          singleLine: true,
        }
      : { destination: 1 },
  },
];

// Generate TraceId for the request
export const generateTraceId = (req: Request): string => {
  return (req.headers['x-trace-id'] as string) || (req as any).id || uuidv4();
};

export const getLogLevel = (req: Request, res: Response, err?: Error): 'info' | 'warn' | 'error' => {
  if (res.statusCode >= 500 || err) return 'error';
  if (res.statusCode >= 400) return 'warn';
  return 'info';
};

//Create pino logger instance
const pinoLogger = pino({
  level: LOG_LEVEL,
  base: undefined,
  transport: { targets: buildTransportTargets() },
});

// Info log
export const InfoLog = (msg: string, data?: any, module?: string) => {
  pinoLogger.info(
    {
      ...data,
      context: module || 'Module',
    },
    msg,
  );
};

// Error log
export const ErrorLog = (msg: string, error?: any, module?: string) => {
  pinoLogger.error(
    {
      ...error,
      context: module || 'Module',
    },
    msg,
  );
};

// Server startup log
export const HttpPortLog = (port: number | string, logger: any) => {
  logger.log(`Nest Application is running on port ${port}`, 'Bootstrap');
};
