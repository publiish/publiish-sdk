import { HttpStatus } from '@nestjs/common';
import { ERROR_MESSAGE } from './messages.js';
import { ApiErrorResponse } from './types.js';

export class ApiError extends Error {
  response: ApiErrorResponse;

  status: HttpStatus;

  success = 'N';

  constructor(
    response: Partial<ApiErrorResponse>,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super('API error');

    this.response = {
      ...ERROR_MESSAGE.UNKNOWN,
      ...response,
      success: 'N',
    };

    this.status = status;
  }
}
