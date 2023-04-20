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
  Head,
  Headers,
  Request,
} from '@nestjs/common';
import { AuthGuard } from './../auth/auth.guard';
import { FileService } from './file.service';
import { DeleteFileResponse, PostFileResponse } from './types';
import { FileInterceptor } from '@nestjs/platform-express';
import { DeleteFileDto, UploadFileDto } from './dto';
import { Brand } from 'src/brand/brand.entity';
import { RequestWithUser } from 'src/auth/types';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get()
  getHello() {
    return this.fileService.getHello();
  }
  @UseGuards(AuthGuard)
  @Post('file_add_update')
  @UseInterceptors(FileInterceptor('upload_file'))
  postFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 * 1024 }), // 10GB
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() body: UploadFileDto,
    @Request() { user }: RequestWithUser,
  ): Promise<PostFileResponse> {
    const { brand_id, auth_user_id } = body;

    return this.fileService.postFile(file, brand_id, auth_user_id, user.id);
  }
  @UseGuards(AuthGuard)
  @Delete('file_delete')
  deleteFile(
    @Body() { brand_id, auth_user_id, cid }: DeleteFileDto,
    @Request() { user }: RequestWithUser,
  ): Promise<DeleteFileResponse> {
    return this.fileService.deleteFile(brand_id, auth_user_id, cid, user.id);
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
