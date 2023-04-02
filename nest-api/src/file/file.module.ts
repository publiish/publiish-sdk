import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { File } from './file.entity';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'tmp/upload');
  },
  filename: function (_req, file, cb) {
    cb(null, file.originalname);
  },
});

@Module({
  imports: [
    TypeOrmModule.forFeature([File]),
    MulterModule.register({
      storage,
    }),
  ],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
