/* eslint-disable class-methods-use-this */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { Response } from 'express';

import { ApiError } from './api-error';
import { ValidationException } from './validation-exception';

import { ApiErrorResponse } from './types';
import { ERROR_MESSAGE } from './messages';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status: number = HttpStatus.BAD_REQUEST;
    let body: Partial<ApiErrorResponse> = {};

    if (exception instanceof ValidationException) {
      status = HttpStatus.BAD_REQUEST;
      body = exception.getResponse();
    } else if (exception instanceof ApiError) {
      status = exception.status;
      body = exception.response;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();

      const data: any = exception.getResponse();

      if (typeof data === 'object') {
        body.code = data.code || undefined;
        body.summary = data.summary || data.message;
      } else {
        body.summary = data;
      }
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      body.summary = exception.message || ERROR_MESSAGE.UNKNOWN;
    }

    response.status(status).send(body);
  }
}
