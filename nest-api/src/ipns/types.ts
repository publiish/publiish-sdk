import { CoreApiResponse } from 'src/interfaces/coreApiResponse';

export interface IpnsPublishResponse extends CoreApiResponse {
  message?: string;
  data: { cid: string; path: string };
}