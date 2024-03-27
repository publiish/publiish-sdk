import { CoreApiResponse } from 'src/interfaces/coreApiResponse.js';

export interface IpnsPublishResponse extends CoreApiResponse {
  message?: string;
  data: { cid: string; path: string; sequence: string };
}

export interface IpnsKeyResponse extends CoreApiResponse {
  message?: string;
  data: {name: string, id: string};
}