import * as bcrypt from 'bcrypt';
import { BRAND_MOCK } from 'src/brand/mocks.js';
import { SigninResponse, SignupResponse } from './types.js';

export const SIGNUP_RESPONSE_MOCK: SignupResponse = {
  status: 200,
  success: 'Y',
  brand: BRAND_MOCK,
};

export const SIGNIN_RESPONSE_MOCK: SigninResponse = {
  status: 200,
  success: 'Y',
  access_token: 'access token',
};

export const PASSWORD_HASH_MOCK = async () =>
  await bcrypt.hash('Password12@', 10);
