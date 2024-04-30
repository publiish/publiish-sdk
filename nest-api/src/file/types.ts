import { CoreApiResponse } from '../interfaces/coreApiResponse.js';

export interface PostFileResponse extends CoreApiResponse {
  message?: string;
  data: Array<{ filename: string; cid: string }>;
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
