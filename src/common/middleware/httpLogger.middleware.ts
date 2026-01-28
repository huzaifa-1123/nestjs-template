import { pinoHttp } from 'pino-http';
import { isDevelopment, LOG_LEVEL } from '../config/constant';
import { buildTransportTargets, generateTraceId, getLogLevel, getOrigin } from '../helpers/logger.utils';
import { Request, Response, RequestHandler } from 'express';
import pino from 'pino';

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
const pinoLogger = pino({
  level: LOG_LEVEL,
  base: undefined,
  transport: { targets: buildTransportTargets() },
});

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
  customLogLevel: getLogLevel,
  autoLogging: true,
  customSuccessMessage: (req, res, responseTime) => buildHttpLogMessage(req, res, responseTime),
  customErrorMessage: (req, res, err) => buildHttpLogMessage(req, res, err),
}) as any;
