import * as fs from 'fs';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import * as FormData from 'form-data';
import { Repository } from 'typeorm';
import { ClusterFile, DeleteFileResponse, PostFileResponse } from './types';
import { File } from './file.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ERROR_MESSAGE } from 'src/common/error/messages';
import { join } from 'path';
import { parseClusterStringResponse } from './helpers';

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

    const filePath = join(uploadedFile.destination, uploadedFile.filename);

    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));

    try {
      const { data } = await axios.post(clusterUrl, form, {
        headers: {
          'Content-Type': `multipart/form-data: boundary=${form.getBoundary()}`,
        },
      });

      let ipfsData: ClusterFile[] =
        typeof data !== 'string'
          ? data.data || [data]
          : parseClusterStringResponse(data);

      const existingFile = await this.fileRepository.findOne({
        where: { brand_id, consumer_id: auth_user_id, cid: ipfsData[0].cid },
      });

      if (existingFile) {
        await this.fileRepository.update(existingFile.id, {
          delete_flag: false,
        });

        fs.unlinkSync(filePath);

        return {
          success: 'Y',
          status: 200,
          cid: existingFile.cid,
          filename: existingFile.filename,
        };
      }

      const file = await this.fileRepository.save(
        new File({
          brand_id,
          cid: ipfsData[0].cid,
          consumer_id: auth_user_id,
          updated_by: auth_user_id,
          created_by: auth_user_id,
          file_type: uploadedFile.mimetype,
          filename: uploadedFile.originalname,
          file_size: uploadedFile.size,
        }),
      );

      fs.unlinkSync(filePath);

      return {
        success: 'Y',
        status: 200,
        cid: file.cid,
        filename: file.filename,
      };
    } catch (error) {
      throw new HttpException(ERROR_MESSAGE.FILE_NOT_UPLOADED, 500);
    }
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

    try {
      await this.fileRepository.update(file.id, { delete_flag: true });

      return {
        success: 'Y',
        status: 200,
        status_code: 200,
        data: 'File has been deleted successfully',
      };
    } catch (error) {
      throw new HttpException(ERROR_MESSAGE.FILE_NOT_DELETED, 500);
    }
  }

  public getPublishLink(cid: string, filename: string) {
    let ipfs_url = process.env.IPFS_URL || 'localhost:8080';

    return {
      status: true,
      link: `${ipfs_url}/ipfs/${cid}?filename=${filename}`,
    };
  }
}
