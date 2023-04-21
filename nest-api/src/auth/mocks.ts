import { BRAND_MOCK } from 'src/brand/mocks';
import { SigninResponse, SignupResponse } from './types';

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
