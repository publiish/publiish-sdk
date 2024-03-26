import { ErrorCode } from './codes';

export const ERROR_MESSAGE = {
  [ErrorCode.USER_ALREADY_EXIST]: {
    summary: 'User with that email already exists',
    code: ErrorCode.USER_ALREADY_EXIST,
  },
  [ErrorCode.USERNAME_TAKEN]: {
    summary: 'Username already taken',
    code: ErrorCode.USERNAME_TAKEN,
  },
  [ErrorCode.INVALID_PAYLOAD]: {
    summary: 'Invalid payload',
    code: ErrorCode.INVALID_PAYLOAD,
  },
  [ErrorCode.UNKNOWN]: {
    summary: 'Unknown error',
    code: ErrorCode.UNKNOWN,
  },
  [ErrorCode.FAILURE]: {
    summary: 'Something went wrong',
    code: ErrorCode.FAILURE,
  },

  [ErrorCode.USER_DOES_NOT_EXIST]: {
    summary: 'User with this email does not exist',
    code: ErrorCode.USER_DOES_NOT_EXIST,
  },
  [ErrorCode.USER_NOT_FOUND]: {
    summary: 'User could not be found',
    code: ErrorCode.USER_NOT_FOUND,
  },
  [ErrorCode.INCORRECT_CREDENTIALS]: {
    summary: 'Incorrect credentials provided',
    code: ErrorCode.INCORRECT_CREDENTIALS,
  },
  [ErrorCode.INVALID_PASSWORD]: {
    summary:
      'Password must contain at least one lowercase, uppercase, number and special character',
    code: ErrorCode.INVALID_PASSWORD,
  },
  [ErrorCode.INVALID_USERNAME_LENGTH]: {
    summary: 'Username must be between 3 and 50 characters long',
    code: ErrorCode.INVALID_USERNAME_LENGTH,
  },
  [ErrorCode.NOT_AUTHORIZED]: {
    summary: 'Not authorized.',
    code: ErrorCode.NOT_AUTHORIZED,
  },
  [ErrorCode.AUTHENTICATION_NOT_FOUND]: {
    summary: 'Authentication not found',
    code: ErrorCode.AUTHENTICATION_NOT_FOUND,
  },
  [ErrorCode.FILE_NOT_FOUND]: {
    summary: 'File could not be found',
    code: ErrorCode.FILE_NOT_FOUND,
  },
  [ErrorCode.FILE_NOT_UPLOADED]: {
    summary: 'File not uploaded, something went wrong',
    code: ErrorCode.FILE_NOT_UPLOADED,
  },
  [ErrorCode.FILE_NOT_DELETED]: {
    summary: 'File not deleted, something went wrong',
    code: ErrorCode.FILE_NOT_UPLOADED,
  },
  [ErrorCode.IPNS_NOT_PUBLISHED]: {
    summary: 'IPNS not published, something went wrong',
    code: ErrorCode.IPNS_NOT_PUBLISHED,
  },
  [ErrorCode.BRAND_ALREADY_EXISTS]: {
    summary: 'Brand already exists',
    code: ErrorCode.BRAND_ALREADY_EXISTS,
  },
  [ErrorCode.BRAND_DOES_NOT_EXIST]: {
    summary: 'Brand does not exists',
    code: ErrorCode.BRAND_DOES_NOT_EXIST,
  },
  [ErrorCode.BRAND_OR_EMAIL_ALREADY_EXISTS]: {
    summary: 'Brand or email already exists',
    code: ErrorCode.BRAND_OR_EMAIL_ALREADY_EXISTS,
  },
  [ErrorCode.ACCESS_TOKEN_DENIED]: {
    summary: 'Access token denied',
    code: ErrorCode.ACCESS_TOKEN_DENIED,
  },
  [ErrorCode.BRAND_ID_DOES_NOT_MATCH]: {
    summary: 'Brand ID does not match',
    code: ErrorCode.BRAND_ID_DOES_NOT_MATCH,
  },
};
