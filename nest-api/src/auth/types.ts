import { Brand } from 'src/brand/brand.entity';
import { CoreApiResponse } from 'src/interfaces/coreApiResponse';

export interface SignupResponse extends CoreApiResponse {
  brand: Brand;
}

export interface SigninResponse extends CoreApiResponse {
  access_token: string;
}
