import { Injectable } from '@nestjs/common';
import { DeleteFileResponse, PostFileResponse } from './types';

@Injectable()
export class FileService {
  getHello(): string {
    return 'Hello World!';
  }

  postFile(): PostFileResponse {
    return {
      success: 'Y',
      status: 200,
      cid: 'QmZULkCELmmk5XNfCgTnCyFgAVxBRBXyDHGGMVoLFLiXEN',
    };
  }

  deleteFile(): DeleteFileResponse {
    return {
      success: 'Y',
      status: 200,
      status_code: 200,
      data: 'File has been deleted successfully',
    };
  }
}
