import { CoreApiResponse } from '../interfaces/coreApiResponse.js';
import { Apikey } from "./apikey.entity.js";

export interface ApikeysResponse extends CoreApiResponse {
  data: Apikey[];
}
