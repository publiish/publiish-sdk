import { HttpStatus } from '@nestjs/common';
import { ERROR_MESSAGE } from './messages';
import { ApiErrorResponse } from './types';

export class ApiError extends Error {
  response: ApiErrorResponse;

  status: HttpStatus;

  constructor(
    response: Partial<ApiErrorResponse>,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super('API error');

    this.response = {
      ...ERROR_MESSAGE.UNKNOWN,
      ...response,
    };

    this.status = status;
  }
}
