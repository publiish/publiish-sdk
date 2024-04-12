import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Redirect,
  UseGuards,
  Request,
  Req,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from './../auth/auth.guard.js';
import { FileService } from './file.service.js';
import { DeleteFileResponse, PostFileResponse } from './types.js';
import { DeleteFileDto, UploadFileDto } from './dto/index.js';
import { RequestWithUser } from 'src/auth/types.js';
import { SkipThrottle } from '@nestjs/throttler';
import { Response } from 'express';
import { ApikeyGuard } from '../apikey/apikey.guard.js';

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

  @UseGuards(ApikeyGuard)
  @Post('file_add_update')
  async postFile(
    @Req() req: RequestWithUser,
    @Query() { auth_user_id }: UploadFileDto,
  ) {
    const result = await this.fileService.postFile(
      req,
      req.user.id,
      auth_user_id,
    );

    return result;
  }

  @UseGuards(AuthGuard)
  @Post('file_chunk_add')
  postChunkFile(
    @Req() req: RequestWithUser,
    @Query() { auth_user_id }: UploadFileDto,
    @Res() res: Response
  ) {
    try {
      this.fileService.postChunkFile(
        req,
        req.user.id,
        auth_user_id,
        res
      );
      // res.status(HttpStatus.NO_CONTENT).send();
    } catch (error) {
      console.log('err', error)
    }

  }

  @UseGuards(ApikeyGuard)
  @Delete('file_delete')
  deleteFile(
    @Query() { auth_user_id, cid }: DeleteFileDto,
    @Request() { user }: RequestWithUser,
  ): Promise<DeleteFileResponse> {
    return this.fileService.deleteFile(user.id, auth_user_id, cid);
  }

  // @Get('publish-link/:cid')
  // getPublishLink(
  //   @Param('cid') cid: string,
  //   @Query('filename') filename: string,
  // ) {
  //   return this.fileService.getPublishLink(cid, filename);
  // }

  @SkipThrottle()
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

  @SkipThrottle()
  @Get('download/:cid')
  @Redirect(process.env.IPFS_URL || 'http://localhost:8080')
  getDocs(@Param('cid') cid: string, @Query('filename') filename: string) {
    let ipfs_url = process.env.IPFS_URL || 'http://localhost:8080';

    return {
      url: `${ipfs_url}/ipfs/${cid}?filename=${filename}&download=true`,
    };
  }
}
