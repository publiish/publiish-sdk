import * as fs from 'fs';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import * as FormData from 'form-data';
import { Repository } from 'typeorm';
import { DeleteFileResponse, PostFileResponse } from './types';
import { File } from './file.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ERROR_MESSAGE } from 'src/common/error/messages';

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

    const form = new FormData();
    form.append('file', uploadedFile.path);

    const { data } = await axios.post(clusterUrl, form, {
      headers: {
        'Content-Type': `multipart/form-data: boundary=${form.getBoundary()}`,
      },
    });

    let ipfsData = typeof data !== 'string' ? JSON.stringify(data) : data;

    const jsonStrings = ipfsData.split('\n');

    const jsonObjects: any = jsonStrings
      .filter((s) => s.length > 0)
      .map((s) => JSON.parse(s));

    const file = await this.fileRepository.save(
      new File({
        brand_id,
        cid: jsonObjects[0].cid,
        consumer_id: auth_user_id,
        updated_by: auth_user_id,
        created_by: auth_user_id,
        file_type: uploadedFile.mimetype,
        filename: uploadedFile.originalname,
      }),
    );

    fs.unlinkSync(uploadedFile.path);

    return {
      success: 'Y',
      status: 200,
      cid: file.cid,
    };
  }

  async deleteFile(
    brand_id: number,
    auth_user_id: number,
    cid: string,
  ): Promise<DeleteFileResponse> {
    const file = await this.fileRepository.findOne({
      where: { brand_id, consumer_id: auth_user_id, cid },
    });

    if (!file) {
      throw new HttpException(
        ERROR_MESSAGE.FILE_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    let clusterUrl = process.env.CLUSTER_URL || 'http://localhost:9094';

    const response = await axios.delete(`${clusterUrl}/pins/${cid}`);

    console.log(response);

    return {
      success: 'Y',
      status: 200,
      status_code: 200,
      data: 'File has been deleted successfully',
    };
  }
}
