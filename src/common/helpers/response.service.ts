import { HttpStatus, Injectable } from '@nestjs/common';

export interface IResponse<T, K> {
  success: boolean;
  statusCode: number;
  data: T | null;
  message: string;
  meta: K | null;
}

@Injectable()
export class ResponseService {
  successResponse<T, K>(
    data: T | null = null,
    meta: K | null = null,
    msg: string = 'Request successful',
    code: number = HttpStatus.OK,
  ): IResponse<T, K> {
    if (typeof data === 'string') {
      return {
        success: true,
        statusCode: code,
        data: null,
        meta,
        message: data,
      };
    }

    return {
      success: true,
      statusCode: code,
      data,
      meta,
      message: msg,
    };
  }
  failedResponse<T, K>(
    data: T | null = null,
    meta: K | null = null,
    msg: string = 'Request Failed',
    code: number = HttpStatus.BAD_REQUEST,
  ): IResponse<T, K> {
    if (typeof data === 'string') {
      return {
        success: false,
        statusCode: code,
        data: null,
        meta,
        message: data,
      };
    }

    return {
      success: false,
      statusCode: code,
      data,
      meta,
      message: msg,
    };
  }
}
