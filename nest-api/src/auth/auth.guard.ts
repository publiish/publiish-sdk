import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
  mixin,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as Ucan from 'ucan-storage/ucan-storage'
import { Service as UcanService } from 'ucan-storage/service'

import { isInvalidEndpoint } from './helpers/validateSubDomain.js';
import { Brand } from '../brand/brand.entity.js';


export const AuthGuard = (options? : {
  checkUcan?: boolean
}) => {
  class AuthGuardMixin implements CanActivate {
    constructor(
      public jwtService: JwtService,
      @InjectRepository(Brand)
      public brandRepository: Repository<Brand>,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const httpContext = context.switchToHttp();
      const request = httpContext.getRequest();

      const token = this.extractTokenFromHeader(request);
      if (!token) {
        throw new UnauthorizedException();
      }
      try {
        if(options?.checkUcan && Ucan.isUcan(token)) {
          const agentDID = request.headers.get('x-agent-did') || '';
          if (!agentDID.startsWith('did:key:')) {
            throw new UnauthorizedException("no DID");
          }
          
          const ucanService = await UcanService.fromPrivateKey(process.env.UCAN_PRIVATE_KEY)

          const { root, cap, issuer } = await ucanService.validateFromCaps(token);
          if (issuer !== agentDID) {
            throw new UnauthorizedException(
              `Expected x-agent-did to be UCAN issuer DID: ${issuer}, instead got ${agentDID}`
            )
          }
          
          const brand = await this.brandRepository.findOne({
            where: [
              { magic_link_id: root.audience() },
              { did: root.audience() }
            ],
          });

          if(!brand)
            throw new UnauthorizedException();
          
          request['user'] = brand;
          request['auth'] = {
            type: 'ucan',
            ucan: {
              token, 
              root: root._decoded.payload,
              cap
            }
          }

          const route = request.route.path;
          if (route == '/api/files/file_delete' && !brand.delete_permission) {
            throw new UnauthorizedException();
          }
          if (route == '/api/files/file_add_update' && !brand.write_permission) {
            throw new UnauthorizedException();
          }

        } else {
          const payload = await this.jwtService.verifyAsync(token, {
            secret: process.env.JWT_SECRET,
          });
          const brand = await this.brandRepository.findOne({
            where: { id: payload.id },
          });
  
          // 💡 We're assigning the payload to the request object here
          // so that we can access it in our route handlers
          request['user'] = brand;
          request['auth'] = {
            type: 'key',
            key: token,
          }
          
          const route = request.route.path;
          if (route == '/api/files/file_delete' && !brand.delete_permission) {
            throw new UnauthorizedException();
          }
          if (route == '/api/files/file_add_update' && !brand.write_permission) {
            throw new UnauthorizedException();
          }
        }
      } catch {
        throw new UnauthorizedException();
      }
      return true;
    }

    extractTokenFromHeader(request: Request): string | undefined {
      const [type, token] = request.headers.authorization?.split(' ') ?? [];
      return type === 'Bearer' || type ==='bearer' ? token : undefined;
    }
  }

  const guard = mixin(AuthGuardMixin);
  return guard;
}
