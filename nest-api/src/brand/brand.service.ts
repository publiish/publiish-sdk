import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ERROR_MESSAGE } from '../common/error/messages.js';
import { Brand } from '../brand/brand.entity.js';
import { StatsResponse } from './types.js';
import { File } from '../file/file.entity.js';

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
        HttpStatus.NOT_FOUND,
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

  async updateBrandProfile( args: {
    id: number,
    brandName?: string,
    brandUrl?: string,
    subDomain?: string,
    daoId?: number
  }) {
    try {
      await this.brandRepository.update(args.id, {
        brand_name: args.brandName,
        brand_url: args.brandUrl,
        sub_domain: args.subDomain,
        dao_id: args.daoId,
      })
      return {
        success: 'Y',
        status: 200,
        Message: 'Profile changed succefully.',
      };
    } catch(error) {
      console.error('error', error);
      return {
        success: 'N',
        status: 200,
        Message: `Something went wrong with update brand profile. error = ${error}`,
      }; 
    }
    
  }
}
