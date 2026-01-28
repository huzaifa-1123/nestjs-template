import { LoggerModule as PinoLoggerModule } from 'pino-nestjs';
import { Request, Response, RequestHandler } from 'express';
import { v4 as uuidv4 } from 'uuid';
import pinoHttp from 'pino-http';
import pino from 'pino';

const isDevelopment = process.env.NODE_ENV === 'development';
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

// Helper: Extract origin from request
const getOrigin = (req: Request): string =>
  req.headers.origin || req.headers['user-agent'] || req.headers.referer || 'N/A';

// Helper: Generate trace ID
const generateTraceId = (req: Request): string => {
  return (req.headers['x-trace-id'] as string) || (req as any).id || uuidv4();
};

// Helper: Get log level based on status code
const getLogLevel = (req: Request, res: Response, err?: Error): 'info' | 'warn' | 'error' => {
  if (res.statusCode >= 500 || err) return 'error';
  if (res.statusCode >= 400) return 'warn';
  return 'info';
};

// Helper: Build transport targets
const buildTransportTargets = () => [
  { // this is for console 
    target: isDevelopment ? 'pino-pretty' : 'pino/file',
    level: 'info',
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

// Helper: Build HTTP log message
const buildHttpLogMessage = (req: Request, res: Response, responseTime: any): string => {
  const origin = getOrigin(req);
  // Access responseTime from req.log context (pino-http adds it there)

  let baseMsg = `${req.method} ${req.url} | ${origin} | Status: ${res.statusCode} | ${responseTime}ms`;

  // Add request body if present
  if (req.body && Object.keys(req.body).length > 0) {
    baseMsg += ` | Body: ${JSON.stringify(req.body)}`;
  }
  return baseMsg;
};

// Create pino logger instance
const pinoLogger = pino({
  level: LOG_LEVEL,
  base: undefined,
  transport: { targets: buildTransportTargets() },
});

// HTTP Logger Middleware
export const httpLoggerMiddleware: RequestHandler = pinoHttp({
  logger: pinoLogger,
  genReqId: generateTraceId,
  customProps: isDevelopment
    ? undefined
    : (req: Request, res: Response) => ({
        traceId: req.id,
        method: req.method,
        url: req.url,
        origin: getOrigin(req),
        statusCode: res.statusCode,
        ...(req.body && Object.keys(req.body).length > 0 && { body: req.body }),
      }),
  serializers: isDevelopment
    ? { req: () => undefined, res: () => undefined, err: () => undefined }
    : {
        req: (req: Request) => ({
          id: req.id,
          method: req.method,
          url: req.url,
          origin: getOrigin(req),
          ...(req.body && Object.keys(req.body).length > 0 && { body: req.body }),
        }),
        res: (res: Response) => ({
          statusCode: res.statusCode,
        }),
        err: () => undefined,
      },
  // serializers: {
  //   req: () => undefined,
  //   res: () => undefined,
  //   err: () => undefined,
  // },
  customLogLevel: getLogLevel,
  autoLogging: true,
  customSuccessMessage: (req, res, responseTime) => buildHttpLogMessage(req, res, responseTime),
  customErrorMessage: (req, res, err) => buildHttpLogMessage(req, res, err),
}) as any;

// NestJS Logger Module
export const LoggerModule = PinoLoggerModule.forRoot({
  pinoHttp: {
    level: LOG_LEVEL,
    base: undefined,
    genReqId: generateTraceId,
    transport: { targets: buildTransportTargets() },
    autoLogging: false,
  },
});

// Server startup log
export const HttpPortLog = (port: number | string, logger: any) => {
  logger.log(`Nest Application is running on port ${port}`, 'Bootstrap');
};
