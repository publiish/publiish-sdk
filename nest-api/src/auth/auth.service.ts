import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ERROR_MESSAGE } from 'src/common/error/messages';
import { Brand } from 'src/brand/brand.entity';
import {
  SigninResponse,
  SignupResponse,
  BrandResponse,
  PermissionResponse,
} from './types';
import { JwtService } from '@nestjs/jwt';
import { isInvalidEndpoint } from './helpers/validateSubDomain';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
  ) {}

  async signup(
    email: string,
    password: string,
    brand_name: string,
  ): Promise<SignupResponse> {
    const existingBrand = await this.brandRepository.findOne({
      where: [{ email }, { brand_name }],
    });

    if (existingBrand) {
      throw new HttpException(
        ERROR_MESSAGE.BRAND_OR_EMAIL_ALREADY_EXISTS,
        HttpStatus.CONFLICT,
      );
    }

    const hash = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUNDS) || 10,
    );

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

  async get_brands(): Promise<BrandResponse> {
    const brands = await this.brandRepository.find();

    return {
      success: 'Y',
      status: 200,
      brands,
    };
  }

  async signin(
    email: string,
    password: string,
    referer?: string,
  ): Promise<SigninResponse> {
    const brand = await this.brandRepository.findOne({ where: { email } });

    if (!brand) {
      throw new HttpException(
        ERROR_MESSAGE.BRAND_DOES_NOT_EXIST,
        HttpStatus.NOT_FOUND,
      );
    }

    if (isInvalidEndpoint(brand, referer)) {
      throw new HttpException(
        ERROR_MESSAGE.ACCESS_TOKEN_DENIED,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isMatch = await bcrypt.compare(password, brand.password);

    if (!isMatch) {
      throw new HttpException(
        ERROR_MESSAGE.INCORRECT_CREDENTIALS,
        HttpStatus.BAD_REQUEST,
      );
    }

    const access_token = await this.jwtService.signAsync({
      email: brand.email,
      brand_name: brand.brand_name,
      brand_url: brand.brand_url,
      id: brand.id,
    });

    return {
      success: 'Y',
      status: 200,
      access_token,
    };
  }

  async change_permission(
    id: number,
    coloumn: string,
    action: boolean,
  ): Promise<PermissionResponse> {
    try {
      if (coloumn == 'write_permission') {
        await this.brandRepository.update(id, {
          write_permission: action,
        });
      }

      if (coloumn == 'delete_permission') {
        await this.brandRepository.update(id, {
          delete_permission: action,
        });
      }

      return {
        success: 'Y',
        status: 200,
        Message: 'Permission changed succefully.',
      };
    } catch (error) {
      return {
        success: 'N',
        status: 200,
        Message: 'Something went wrong.',
      };
    }
  }
}
