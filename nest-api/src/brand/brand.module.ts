import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from 'src/brand/brand.entity';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';
import { File } from 'src/file/file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Brand, File])],
  controllers: [BrandController],
  providers: [BrandService],
})
export class BrandModule {}
