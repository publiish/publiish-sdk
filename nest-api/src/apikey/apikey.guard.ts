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
  import { Brand } from '../brand/brand.entity.js';
  
  @Injectable()
  export class ApikeyGuard implements CanActivate {
    constructor(
      private jwtService: JwtService,
      @InjectRepository(Brand)
      private brandRepository: Repository<Brand>,
    ) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const httpContext = context.switchToHttp();
      const request = httpContext.getRequest();
      
      const apikey = this.extractApikeyFromHeader(request);
      if (!apikey) {
        throw new UnauthorizedException();
      }

      try {
        const payload = await this.jwtService.verifyAsync(apikey, {
          secret: process.env.JWT_SECRET,
        });

        const brand = await this.brandRepository.findOne({
          where: { id: payload.brandId },
        });
  
        // 💡 We're assigning the payload to the request object here
        // so that we can access it in our route handlers
        request['user'] = brand;
  
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
  
    private extractApikeyFromHeader(request: Request): string | undefined {
      const { apikey } = request.headers;
      return apikey.toString();
    }
  }
  