import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { DeleteFileResponse, PostFileResponse } from './types';
import { File } from './file.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
  ) {}

  async getHello(): Promise<File[]> {
    return await this.fileRepository.find();
  }

  async postFile(): Promise<PostFileResponse> {
    const file = await this.fileRepository.save(
      new File({
        brand_id: 1,
        cid: 'asdasdsadasdasdas',
        consumer_id: 1,
        updated_by: 1,
        created_by: 1,
        file_type: 'image',
        filename: 'filename',
      }),
    );

    return {
      success: 'Y',
      status: 200,
      cid: file.cid,
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
