import { Injectable } from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import { ErrorLog, InfoLog } from '../helpers/logger.utils';
import { extractQueryParams } from 'src/common/helpers/utils';

@Injectable()
export class AxiosApiService {
  constructor() {}

  cleanAxiosError(error: AxiosError): any {
    // Extract basic request info
    const method = error?.config?.method?.toUpperCase() || 'UNKNOWN';
    const url = error?.config?.url || 'UNKNOWN_URL';
    // Extract response data if available
    const status = error?.response?.status;
    const statusText = error?.response?.statusText;
    const responseData = error?.response?.data;

    // Extract request details
    const requestParams = error?.config?.params || error?.request?.params || extractQueryParams(url);
    const requestBody = error?.config?.data ? JSON.parse(error?.config?.data) : undefined;

    return {
      request: {
        method,
        url,
        params: requestParams,
        body: requestBody,
      },
      response: status
        ? {
            status,
            statusText,
            data: responseData,
          }
        : undefined,
      message: error?.message || 'Unknown error',
      name: error?.name || 'Error',
    };
  }

  async get(url: string, config: any): Promise<any> {
    try {
      const startTime = new Date();
      InfoLog(`GET ${url}`, { config: config }, 'Request');
      //   const response = await axios.get(url, config);
      const response = await axios.get(url, config);
      const endTime = new Date();
      const timeTaken = endTime.getTime() - startTime.getTime();
      InfoLog(
        `GET ${url} `,
        {
          config: config,
          timeTaken: `${timeTaken} ms`,
          response: response?.data,
        },
        'Response',
      );
      return response;
    } catch (error: any) {
      ErrorLog(`GET ${url} `, {
        config: config,
        error: this.cleanAxiosError(error),
      });
      throw error;
    }
  }

  async post(url: string, payload: any, config: any): Promise<any> {
    try {
      const startTime = new Date();
      const safePayload = payload;
      InfoLog(`POST ${url} `, { config: config, payload: safePayload }, 'Request');

      // Send original unfiltered payload to API
      const response = await axios.post(url, payload, config);

      const endTime = new Date();
      const timeTaken = endTime.getTime() - startTime.getTime();
      InfoLog(
        `POST ${url} `,
        {
          config: config,
          payload: safePayload,
          timeTaken: `${timeTaken} ms`,
          response: response?.data,
        },
        'Response',
      );
      return response;
    } catch (error: any) {
      const safePayload = payload;
      ErrorLog(`POST ${url} `, {
        config: config,
        payload: safePayload,
        error: this.cleanAxiosError(error),
      });
      throw error;
    }
  }

  async put(url: string, payload: any, config: any): Promise<any> {
    try {
      const startTime = new Date();
      InfoLog(`PUT ${url} `, { config: config, payload: payload }, 'Request');
      const response = await axios.put(url, payload, config);
      const endTime = new Date();
      const timeTaken = endTime.getTime() - startTime.getTime();
      InfoLog(
        `PUT ${url} `,
        {
          config: config,
          payload: payload,
          timeTaken: `${timeTaken} ms`,
          response: response?.data,
        },
        'Response',
      );
      return response;
    } catch (error: any) {
      ErrorLog(`PUT ${url} `, {
        config: config,
        payload: payload,
        error: this.cleanAxiosError(error),
      });
      throw error;
    }
  }

  async patch(url: string, payload: any, config: any): Promise<any> {
    try {
      const startTime = new Date();
      InfoLog(`PATCH ${url} `, { config: config, payload: payload }, 'Request');
      const response = await axios.patch(url, payload, config);
      const endTime = new Date();
      const timeTaken = endTime.getTime() - startTime.getTime();
      InfoLog(
        `PATCH ${url} `,
        {
          config: config,
          payload: payload,
          timeTaken: `${timeTaken} ms`,
          response: response?.data,
        },
        'Response',
      );
      return response;
    } catch (error: any) {
      ErrorLog(`PATCH ${url} `, {
        config: config,
        payload: payload,
        error: this.cleanAxiosError(error),
      });
      throw error;
    }
  }

  async delete(url: string, config: any): Promise<any> {
    try {
      const startTime = new Date();
      InfoLog(`DELETE ${url} `, { config: config }, 'Request');
      const response = await axios.delete(url, config);
      const endTime = new Date();
      const timeTaken = endTime.getTime() - startTime.getTime();
      InfoLog(
        `DELETE ${url} `,
        {
          config: config,
          timeTaken: `${timeTaken} ms`,
          response: response?.data,
        },
        'Response',
      );
      return response;
    } catch (error: any) {
      ErrorLog(`DELETE ${url} `, {
        config: config,
        error: this.cleanAxiosError(error),
      });
      throw error;
    }
  }
}
