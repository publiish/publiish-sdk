import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Redirect,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { DeleteFileResponse, PostFileResponse } from './types';
import { FileInterceptor } from '@nestjs/platform-express';
import { DeleteFileDto, UploadFileDto } from './dto';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get()
  getHello() {
    return this.fileService.getHello();
  }

  @Post('file_add_update')
  @UseInterceptors(FileInterceptor('upload_file'))
  postFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadFileDto,
  ): Promise<PostFileResponse> {
    const { brand_id, auth_user_id } = body;

    return this.fileService.postFile(file, brand_id, auth_user_id);
  }

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
