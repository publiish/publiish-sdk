import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { isInvalidEndpoint } from './helpers/validateSubDomain.js';
import { Brand } from '../brand/brand.entity.js';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      const brand = await this.brandRepository.findOne({
        where: { id: payload.id },
      });

      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = brand;

      const referer: string = request.headers['referer'];

      if (isInvalidEndpoint(brand, referer)) {
        throw new UnauthorizedException();
      }

      const route = request.route.path;
      if (route == '/api/files/file_delete' && !brand.delete_permission) {
        throw new UnauthorizedException();
      }
      if (route == '/api/files/file_add_update' && !brand.write_permission) {
        throw new UnauthorizedException();
      }
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
