import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ERROR_MESSAGE } from 'src/common/error/messages';
import { Brand } from 'src/brand/brand.entity';
import { StatsResponse } from './types';
import { File } from 'src/file/file.entity';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
    @InjectRepository(File)
    private fileRepository: Repository<File>,
  ) {}

  async getStats(id: number): Promise<StatsResponse> {
    const brand = await this.brandRepository.findOne({
      where: { id },
    });

    if (!brand) {
      throw new HttpException(
        ERROR_MESSAGE.BRAND_DOES_NOT_EXIST,
        HttpStatus.CONFLICT,
      );
    }

    const files = await this.fileRepository.find({
      where: { brand_id: brand.id },
    });

    const bytes_uploaded = files.reduce(
      (acc, current) => acc + (current.file_size || 0),
      0,
    );

    return {
      success: 'Y',
      status: 200,
      data: {
        bytes_uploaded,
        files_uploaded: files.length,
      },
    };
  }
}
