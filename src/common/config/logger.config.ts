import { LoggerModule as PinoLoggerModule } from 'pino-nestjs';
import { RequestMethod } from '@nestjs/common';
import { LOG_LEVEL } from './constant';
import { buildTransportTargets, generateTraceId } from '../helpers/logger.utils';

// NestJS Logger Module
export const LoggerModule = PinoLoggerModule.forRoot({
  pinoHttp: {
    level: LOG_LEVEL,
    base: undefined,
    genReqId: generateTraceId,
    transport: { targets: buildTransportTargets() },
    autoLogging: false,
  },
  forRoutes: [{ method: RequestMethod.ALL, path: '*splat' }], // if this is not provided then a warning comes up with Unsupported route path: "/api/*"
});
