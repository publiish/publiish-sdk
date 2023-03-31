import { CoreApiResponse } from 'src/interfaces/coreApiResponse';

export interface PostFileResponse extends CoreApiResponse {
  cid?: string;
  message?: string;
}

export interface DeleteFileResponse extends CoreApiResponse {
  status_code?: number;
  data?: string;
}
