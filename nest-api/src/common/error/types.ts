import { ErrorCode } from './codes.js';

export interface ApiErrorResponse {
  /** error code for handling edge cases */
  code?: number | ErrorCode;
  /** error message for display */
  summary: string;
  /** details for usage with payload validation */
  details?: Record<string, string[]>;
  success: 'N';
}
