import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as FormData from 'form-data';
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

  async postFile(
    uploadedFile: Express.Multer.File,
    brand_id: number,
    auth_user_id: number,
  ): Promise<PostFileResponse> {
    let clusterUrl = process.env.CLUSTER_URL || 'http://localhost:9094';
    //add endpoint
    clusterUrl += '/add';
    //check and add cid version default is zero
    if (process.env.CLUSTER_CONF_CID_VERSION) {
      clusterUrl += '?' + process.env.CLUSTER_CONF_CID_VERSION;
    }

    console.log(clusterUrl);
    const form = new FormData();
    form.append('path', uploadedFile.destination);
    form.append('name', uploadedFile.originalname);

    const response = await axios.post(clusterUrl, form, {
      headers: {
        'Content-Type': `multipart/form-data: boundary=${form.getBoundary()}`,
      },
    });

    // const file = await this.fileRepository.save(
    //   new File({
    //     brand_id,
    //     cid: response.data.cid,
    //     consumer_id: auth_user_id,
    //     updated_by: auth_user_id,
    //     created_by: auth_user_id,
    //     file_type: uploadedFile.mimetype,
    //     filename: uploadedFile.originalname,
    //   }),
    // );

    return {
      success: 'Y',
      status: 200,
      cid: 'asdasdas',
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

const asdasd = {
  name: '',
  cid: 'Qme4RdmZTMdG37oSs7XkCNeXHnSVJpNTmdx5LazS3rKeeJ',
  size: 16,
  allocations: ['12D3KooWKZzcjFjaTjFFDpHuu9tK7qBwFdUeqMYYfoEi2qpaWyTD'],
};
