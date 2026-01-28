import 'dotenv/config';
// Set timezone from environment variable, default to UTC if not provided
process.env.TZ = process.env.TZ || 'UTC';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
// import fs from 'fs';
import { Response } from 'express';
import { Logger } from 'pino-nestjs';
import { HttpPortLog } from './common/helpers/logger.utils';
import { httpLoggerMiddleware } from './common/middleware/httpLogger.middleware';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { traceIdMiddleware } from './common/middleware/traceId.middleware';
const port = process.env.PORT || 3000;

async function bootstrap() {
  const NestFactoryOptions: any = {
    bufferLogs: true, // Buffer logs until logger is attached
    logger: false, // Disable default NestJS logger
  };
  // for now disabling ssl part

  // const httpsOptions = {
  //   key: fs.readFileSync('./ssl/keyfile-encrypted.key'),
  //   cert: fs.readFileSync('./ssl/97580e4c070d1482.crt'),
  //   ca: [fs.readFileSync('./ssl/gd1.crt')],
  //   passphrase: 'Mlajan@123##',
  // };

  // if (process.env.SSL === 'true') {
  //   //enable ssl..
  //   NestFactoryOptions['httpsOptions'] = httpsOptions;
  // }

  const app = await NestFactory.create<NestExpressApplication>(AppModule, NestFactoryOptions);

  // Apply HTTP logging middleware
  app.use(httpLoggerMiddleware);

  app.use(traceIdMiddleware);
  // Use pino logger
  const logger = app.get(Logger);
  app.useLogger(logger);

  // Apply global exception filter with logger injection
  app.useGlobalFilters(new GlobalExceptionFilter(logger));

  // Enable global validation pipe
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // global prefix. for every service it will be different
  app.setGlobalPrefix('api');

  //handle browser cros..
  app.enableCors();

  //health check route
  app.use('/api/_status', (req: Request, res: Response) => {
    res.status(200).json('The service is up and running successfully');
  });
  try {
    await app.listen(port, () => HttpPortLog(port, logger));
  } catch (error) {
    logger.error(error);
  }
}
bootstrap();
