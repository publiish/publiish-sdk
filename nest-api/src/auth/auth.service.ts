import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ERROR_MESSAGE } from 'src/common/error/messages';
import { Brand } from 'src/brand/brand.entity';
import { SigninResponse, SignupResponse } from './types';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
  ) {}

  async signup(
    email: string,
    password: string,
    brand_name: string,
  ): Promise<SignupResponse> {
    const existingBrand = await this.brandRepository.findOne({
      where: { email, brand_name },
    });

    if (existingBrand) {
      throw new HttpException(
        ERROR_MESSAGE.BRAND_ALREADY_EXISTS,
        HttpStatus.CONFLICT,
      );
    }

    const hash = await bcrypt.hash(password, process.env.SALT_ROUNDS || 10);

    const brand = await this.brandRepository.save(
      new Brand({ email, password: hash, brand_name }),
    );

    delete brand.password;

    return {
      success: 'Y',
      status: 200,
      brand,
    };
  }

  async signin(email: string, password: string): Promise<SigninResponse> {
    const brand = await this.brandRepository.findOne({ where: { email } });

    if (!brand) {
      throw new HttpException(
        ERROR_MESSAGE.BRAND_DOES_NOT_EXIST,
        HttpStatus.NOT_FOUND,
      );
    }

    const isMatch = await bcrypt.compare(password, brand.password);

    if (!isMatch) {
      throw new HttpException(
        ERROR_MESSAGE.INVALID_PASSWORD,
        HttpStatus.BAD_REQUEST,
      );
    }

    const access_token = jwt.sign(
      {
        email: brand.email,
        brand_name: brand.brand_name,
        brand_url: brand.brand_url,
      },
      process.env.JWT_SECRET,
    );

    return {
      success: 'Y',
      status: 200,
      access_token,
    };
  }
}
