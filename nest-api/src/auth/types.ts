import { Request } from 'express';
import { Brand } from 'src/brand/brand.entity';
import { CoreApiResponse } from 'src/interfaces/coreApiResponse';

export interface SignupResponse extends CoreApiResponse {
  brand: Brand;
}
export interface BrandResponse extends CoreApiResponse {
  brands: Brand[];
}

export interface SigninResponse extends CoreApiResponse {
  access_token: string;
}
export interface PermissionResponse extends CoreApiResponse {
  Message: string;
}

export interface RequestWithUser extends Request {
  user: Brand;
}
