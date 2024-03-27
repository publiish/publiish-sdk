import * as fs from 'fs';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import FormData from 'form-data';
import { In, Repository } from 'typeorm';
import { ClusterFile, DeleteFileResponse, PostFileResponse } from './types.js';
import { File } from './file.entity.js';
import { Brand } from '../brand/brand.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { ERROR_MESSAGE } from '../common/error/messages.js';
import path, { join } from 'path';
import { parseClusterStringResponse } from './helpers/index.js';
import { Readable } from 'stream';
import { FileInfo } from 'busboy';
import { RequestWithUser } from '../auth/types.js';
import mime from 'mime-types';
import chunkReceive, { cleanChunks } from '../lib/chunk-receiver.js';
import { Response } from 'express';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
  ) {}

  async getHello(): Promise<File[]> {
    return await this.fileRepository.find();
  }

  async postFile(
    req: RequestWithUser,
    brand_id: number,
    auth_user_id: number,
    // loggedInUserId: number,
  ): Promise<PostFileResponse> {
    // if (Number(brand_id) !== loggedInUserId) {
    //   throw new HttpException(
    //     ERROR_MESSAGE.BRAND_ID_DOES_NOT_MATCH,
    //     HttpStatus.FORBIDDEN,
    //   );
    // }

    const brand = await this.brandRepository.findOne({ where: { id: brand_id } });

    if (!brand) {
      throw new HttpException(
        ERROR_MESSAGE.BRAND_DOES_NOT_EXIST,
        HttpStatus.NOT_FOUND,
      );
    }

    let clusterUrl = process.env.CLUSTER_URL || 'http://localhost:9094';
    //add endpoint
    clusterUrl += '/add';
    //check and add cid version default is zero
    if (process.env.CLUSTER_CONF_CID_VERSION) {
      clusterUrl += '?' + process.env.CLUSTER_CONF_CID_VERSION;
    }

    function generateBoundary() {
      return `--${new Date()
        .toISOString()
        .replace(/[-:.]/g, '')}-${Math.random().toString(36).substring(2)}`;
    }

    const boundary = generateBoundary();

    const contentTypeHeaderIndex = req.rawHeaders.indexOf('Content-Type');
    let contentType = 'multipart/form-data; boundary=' + boundary;

    if (
      contentTypeHeaderIndex !== -1 &&
      contentTypeHeaderIndex < req.rawHeaders.length - 1
    ) {
      // Use the Content-Type header from req.rawHeaders
      contentType = req.rawHeaders[contentTypeHeaderIndex + 1];
    }

    try {
      const { data } = await axios.post(clusterUrl, req, {
        headers: {
          'Content-Type': contentType,
          ...req.headers,
        },
      });

      let ipfsData: ClusterFile[] =
        typeof data !== 'string'
          ? data.data || [data]
          : parseClusterStringResponse(data);

      const existingFiles = await this.fileRepository.find({
        where: {
          brand_id,
          consumer_id: auth_user_id,
          cid: In(ipfsData.map((ipfsFile) => ipfsFile.cid)),
        },
      });

      const files = ipfsData.map((ipfsFile) => {
        const existingFile = existingFiles.find(
          (existing) => existing.cid === ipfsFile.cid,
        );
        return {
          ...(existingFile ? { id: existingFile.id } : {}),
          brand_id,
          cid: ipfsFile.cid,
          consumer_id: auth_user_id,
          updated_by: auth_user_id,
          created_by: auth_user_id,
          file_type: mime.lookup(ipfsFile.name) || 'N/A',
          filename: ipfsFile.name,
          file_size: ipfsFile.size,
          delete_flag: false,
        };
      });

      const savedFiles = await this.fileRepository.save(files);

      return {
        success: 'Y',
        status: 200,
        data: savedFiles.map((file) => ({
          cid: file.cid,
          filename: file.filename,
        })),
      };
    } catch (error) {
      console.log('error ', error.message);

      throw new HttpException(ERROR_MESSAGE.FILE_NOT_UPLOADED, 500);
    }
  }

  async postChunkFile(
    req: RequestWithUser,
    brand_id: number,
    auth_user_id: number,
    // loggedInUserId: number,
    res: Response
  ): Promise<any> {

    // const brand = await this.brandRepository.findOne({ where: { id: args.brand_id } });

    // if (!brand) {
    //   throw new HttpException(
    //     ERROR_MESSAGE.BRAND_DOES_NOT_EXIST,
    //     HttpStatus.NOT_FOUND,
    //   );
    // }

    const tmpDir = process.env.TMP_PATH ?? '/media/root/data/tmp/';
    const maxFileSize = Number(process.env.MAX_FILE_SIZE) ?? 5 * 1024 * 1024 * 1024;  // 5GB
    const maxChunkSize = Number(process.env.MAX_CHUNK_SIZE) ?? 100 * 1024 * 1024; // 100 MB

    // Replace with the actual logic to receive and handle the file upload
    try {
        chunkReceive(req, tmpDir, maxFileSize, maxChunkSize)
        .then((assembleChunks:any)=>{
          if (assembleChunks) {
            assembleChunks()
            .then(data=> {
              console.log('data', data)
              res.status(HttpStatus.OK).send(data);
              this.uploadFile2IPFS({brand_id, auth_user_id, file: data.filePath})
            })
            .catch(err=>console.log('err', err));
          } else {
            res.status(HttpStatus.NO_CONTENT).send();
          }
        })
        .catch((error)=>{
          if (error.message) {
            let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            const message = error.message;
  
            // Update status code based on error message
            if (message.includes('Missing header(s)') || message.includes('Missing Content-Type') || message.includes('Unsupported content type') || message.includes('Chunk is out of range')) {
                statusCode = HttpStatus.BAD_REQUEST;
            } else if (message.includes('File is above size limit') || message.includes('Chunk is above size limit')) {
                statusCode = HttpStatus.PAYLOAD_TOO_LARGE;
            } else if (message === 'Upload has expired') {
                statusCode = HttpStatus.GONE;
            }
  
            res.status(statusCode).send({ message });
            return;
          }
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
        })
        
    } catch (error) {
        throw error;
    }
  }

  async uploadFile2IPFS( args: {
    brand_id: number,
    auth_user_id: number,
    file: string,
  }) {
    let clusterUrl = process.env.CLUSTER_URL || 'http://localhost:9094';
    //add endpoint
    clusterUrl += '/add';
    //check and add cid version default is zero
    if (process.env.CLUSTER_CONF_CID_VERSION) {
      clusterUrl += '?' + process.env.CLUSTER_CONF_CID_VERSION;
    }

    function generateBoundary() {
      return `--${new Date()
        .toISOString()
        .replace(/[-:.]/g, '')}-${Math.random().toString(36).substring(2)}`;
    }

    const boundary = generateBoundary();

    let contentType = 'multipart/form-data; boundary=' + boundary;

    const formData = new FormData();
    const fileStream = fs.createReadStream(args.file);
    var filename = args.file.replace(/^.*[\\/]/, '')
    formData.append("file", fileStream, filename);

    try {
      const { data } = await axios.post(clusterUrl, formData, {
        headers: {
          'Content-Type': contentType,
        },
      });

      let ipfsData: ClusterFile[] =
        typeof data !== 'string'
          ? data.data || [data]
          : parseClusterStringResponse(data);

      const existingFiles = await this.fileRepository.find({
        where: {
          brand_id:args.brand_id,
          consumer_id: args.auth_user_id,
          cid: In(ipfsData.map((ipfsFile) => ipfsFile.cid)),
        },
      });

      const files = ipfsData.map((ipfsFile) => {
        const existingFile = existingFiles.find(
          (existing) => existing.cid === ipfsFile.cid,
        );
        return {
          ...(existingFile ? { id: existingFile.id } : {}),
          brand_id: args.brand_id,
          cid: ipfsFile.cid,
          consumer_id: args.auth_user_id,
          updated_by: args.auth_user_id,
          created_by: args.auth_user_id,
          file_type: mime.lookup(ipfsFile.name) || 'N/A',
          filename: ipfsFile.name,
          file_size: ipfsFile.size,
          delete_flag: false,
        };
      });

      const savedFiles = await this.fileRepository.save(files);

      const folderPath = args.file.substring(0, args.file.lastIndexOf('/'));
      cleanChunks(folderPath);
      
      return {
        success: 'Y',
        status: 200,
        data: savedFiles.map((file) => ({
          cid: file.cid,
          filename: file.filename,
        })),
      };
    } catch (error) {
      console.log('error ', error.message);

      throw error;
    }
  }

  async deleteFile(
    brand_id: number,
    auth_user_id: number,
    cid: string,
    loggedInUserId: number,
  ): Promise<DeleteFileResponse> {
    // if (Number(brand_id) !== loggedInUserId) {
    //   throw new HttpException(
    //     ERROR_MESSAGE.BRAND_ID_DOES_NOT_MATCH,
    //     HttpStatus.FORBIDDEN,
    //   );
    // }

    const brand = await this.brandRepository.findOne({ where: { id: brand_id } });

    if (!brand) {
      throw new HttpException(
        ERROR_MESSAGE.BRAND_DOES_NOT_EXIST,
        HttpStatus.NOT_FOUND,
      );
    }
    
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
