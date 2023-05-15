import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { File } from './file.entity';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';
import { JwtModule } from '@nestjs/jwt';
import { Brand } from 'src/brand/brand.entity';

import * as fs from 'fs';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = '/app/tmp/upload';

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (_req, file, cb) {
    cb(null, file.originalname);
  },
});

@Module({
  imports: [
    TypeOrmModule.forFeature([File]),
    TypeOrmModule.forFeature([Brand]),
    MulterModule.register({
      dest: '/app/tmp/upload',
      storage,
      limits: {
        fileSize: 10 * 1024 * 1024 * 1024, // limit to 10GB
      },
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
