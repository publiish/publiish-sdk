import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ERROR_MESSAGE } from '../common/error/messages.js';
import { Brand } from '../brand/brand.entity.js';
import {
  SigninResponse,
  SignupResponse,
  BrandResponse,
  PermissionResponse,
} from './types.js';
import { JwtService } from '@nestjs/jwt';
import { isInvalidEndpoint } from './helpers/validateSubDomain.js';
import { Magic } from '@magic-sdk/admin';
import { Request } from 'express';
import { parseMagic } from '../lib/magic-lib.js';

@Injectable()
export class AuthService {
  private magic:Magic;
  
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
  ) {
    this.magic = new Magic(process.env.MAGIC_SECRET_KEY);
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  async signup(
    req: Request,
    brand_name: string,
  ): Promise<SignupResponse> {

    const auth = req.headers.authorization ?? "";
    const token = this.magic.utils.parseAuthorizationHeader(auth);
    this.magic.token.validate(token);
    const metadata = await this.magic.users.getMetadataByToken(token);

    if (!metadata.issuer) {
      throw new HttpException(
        "No user did token",
        HttpStatus.UNAUTHORIZED,
      );
    }
    
    const parsed = parseMagic(metadata);

    const existingBrand = await this.brandRepository.findOne({
      where: [{ email: parsed.email }, { brand_name }],
    });

    if (existingBrand) {
      throw new HttpException(
        ERROR_MESSAGE.BRAND_OR_EMAIL_ALREADY_EXISTS,
        HttpStatus.CONFLICT,
      );
    }

    const brand = await this.brandRepository.save(
      new Brand({ email: parsed.email, password: "", brand_name, magic_link_id: parsed.issuer, public_address: parsed.publicAddress }),
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
    req: Request,
  ): Promise<SigninResponse> {
    const auth = req.headers.authorization ?? "";
    const token = this.magic.utils.parseAuthorizationHeader(auth);
    this.magic.token.validate(token);
    const metadata = await this.magic.users.getMetadataByToken(token);

    if (!metadata.issuer) {
      throw new HttpException(
        "No user did token",
        HttpStatus.UNAUTHORIZED,
      );
    }
    
    const parsed = parseMagic(metadata);

    const brand = await this.brandRepository.findOne({
      where: [{ email: parsed.email }],
    });

    if (!brand) {
      throw new HttpException(
        ERROR_MESSAGE.BRAND_DOES_NOT_EXIST,
        HttpStatus.NOT_FOUND,
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
