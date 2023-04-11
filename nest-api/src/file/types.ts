import { CoreApiResponse } from 'src/interfaces/coreApiResponse';

export interface PostFileResponse extends CoreApiResponse {
  cid: string;
  message?: string;
  data?: any;
  filename: string;
}

export interface DeleteFileResponse extends CoreApiResponse {
  status_code?: number;
  data?: string;
}

export interface ClusterFile {
  name: string;
  cid: string;
  size: number;
  allocations: [ArrayBuffer];
}
