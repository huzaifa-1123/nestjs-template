import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { Response, Request } from 'express';
import { IResponse } from '../utils/Response';
import { Logger } from 'pino-nestjs';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(@Inject(Logger) private readonly logger: Logger) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let data: any = null;

    const isBasicError= [HttpException,NotFoundException,BadRequestException].some((errType)=>exception instanceof errType)

    if (isBasicError) {
      status = (exception as any)?.getStatus() || 500;
      const exceptionResponse = (exception as any)?.getResponse() || 'Internal server error';
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const exceptionResponseObject=(exceptionResponse as any)
        message = exceptionResponseObject?.message || exceptionResponseObject?.data?.message
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(exception,(exception as any).stack,"GlobalException");
    }

    // Log the error with proper JSON format

    const errorResponse: IResponse<any, null> = {
      success: false,
      statusCode: status,
      data,
      message,
      meta: null,
    };

    response.status(status).json(errorResponse);
  }
}
