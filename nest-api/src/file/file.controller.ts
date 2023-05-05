import {
  Body,
  Controller,
  Delete,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Query,
  Redirect,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Req,
  HttpException,
} from '@nestjs/common';
import * as Busboy from 'busboy';
import { AuthGuard } from './../auth/auth.guard';
import { FileService } from './file.service';
import { DeleteFileResponse, PostFileResponse } from './types';
import { FileInterceptor } from '@nestjs/platform-express';
import { DeleteFileDto, UploadFileDto } from './dto';
import { Request } from 'express';
import { validate } from 'class-validator';
import { FileInfo } from 'busboy';
import { PassThrough, Readable } from 'stream';
import { plainToClass } from 'class-transformer';
import { ValidationException } from 'src/common/error/validation-exception';
import { streamToBuffer } from './helpers';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get()
  getHello() {
    return this.fileService.getHello();
  }

  // @UseGuards(AuthGuard)
  // @Post('file_add_update')
  // @UseInterceptors(FileInterceptor('upload_file'))
  // postFile(
  //   @UploadedFile(
  //     new ParseFilePipe({
  //       validators: [
  //         new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 * 1024 }), // 10GB
  //       ],
  //     }),
  //   )
  //   file: Express.Multer.File,
  //   @Body() body: UploadFileDto,
  // ): Promise<PostFileResponse> {
  //   const { brand_id, auth_user_id } = body;

  //   return this.fileService.postFile(file, brand_id, auth_user_id);
  // }

  @Post('file_add_update')
  async postFile(@Req() req: Request) {
    const busboy = Busboy({
      headers: req.headers,
      limits: { fileSize: 10 * 1024 * 1024 * 1024 },
    }); // limit to 10GB}
    let buffer: Buffer;
    let fileStream: Readable;
    let fileInfo: FileInfo;
    let dto = new UploadFileDto();
    const errors = [];

    const result = await new Promise((resolve, reject) => {
      // listen for the file event to extract the file stream
      busboy.on('file', async (_fieldname, file, info) => {
        (fileStream = file), (fileInfo = info);

        const passThrough = new PassThrough();
        fileStream.pipe(passThrough); // consume the file stream

        buffer = await streamToBuffer(passThrough); // convert to buffer

        fileStream.resume();
      });

      busboy.on('field', (fieldname, value) => {
        dto[fieldname] = value;
      });

      busboy.on('close', async () => {
        try {
          const validationErrors = await validate(
            plainToClass(UploadFileDto, dto),
          ); // validate the dto using class-validator
          if (validationErrors.length > 0) {
            errors.push(...validationErrors);
          }
          if (!fileStream) {
            errors.push(new Error('No file found in the request.'));
          }
          if (errors.length > 0) {
            throw new ValidationException(errors);
          }

          const result = await this.fileService.postFile(
            buffer,
            fileInfo,
            dto.brand_id,
            dto.auth_user_id,
          );

          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      req.pipe(busboy);
    });

    return result;
  }

  @UseGuards(AuthGuard)
  @Delete('file_delete')
  deleteFile(
    @Body() { brand_id, auth_user_id, cid }: DeleteFileDto,
  ): Promise<DeleteFileResponse> {
    return this.fileService.deleteFile(brand_id, auth_user_id, cid);
  }

  // @Get('publish-link/:cid')
  // getPublishLink(
  //   @Param('cid') cid: string,
  //   @Query('filename') filename: string,
  // ) {
  //   return this.fileService.getPublishLink(cid, filename);
  // }

  @Get('publish-link/:cid')
  @Redirect(process.env.IPFS_URL || 'http://localhost:8080')
  getPublishLink(
    @Param('cid') cid: string,
    @Query('filename') filename: string,
  ) {
    let ipfs_url = process.env.IPFS_URL || 'http://localhost:8080';

    return {
      url: `${ipfs_url}/ipfs/${cid}?filename=${filename}`,
    };
  }

  @Get('download/:cid')
  @Redirect(process.env.IPFS_URL || 'http://localhost:8080')
  getDocs(@Param('cid') cid: string, @Query('filename') filename: string) {
    let ipfs_url = process.env.IPFS_URL || 'http://localhost:8080';

    return {
      url: `${ipfs_url}/ipfs/${cid}?filename=${filename}&download=true`,
    };
  }
}
