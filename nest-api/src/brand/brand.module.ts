import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from '../brand/brand.entity.js';
import { BrandController } from './brand.controller.js';
import { BrandService } from './brand.service.js';
import { File } from '../file/file.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Brand, File])],
  controllers: [BrandController],
  providers: [BrandService],
})
export class BrandModule {}
