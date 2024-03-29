import { CoreApiResponse } from 'src/interfaces/coreApiResponse.js';

export interface StatsResponse extends CoreApiResponse {
  data: {
    files_uploaded: number;
    bytes_uploaded: number;
  };
}
