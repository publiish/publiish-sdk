import { Controller, Delete, Get, Post } from '@nestjs/common';
import { FileService } from './file.service';
import { DeleteFileResponse, PostFileResponse } from './types';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get()
  getHello(): string {
    return this.fileService.getHello();
  }

  @Post('file_add_update')
  postFile(): PostFileResponse {
    return this.fileService.postFile();
  }

  @Delete('file_delete')
  deletFile(): DeleteFileResponse {
    return this.fileService.deleteFile();
  }
}
