import { HttpException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brand } from "../brand/brand.entity.js";
import { Repository } from "typeorm";
import { Service } from 'publiish-ucan/service'
@Injectable()
export class UcanService {
  private serviceUcan:Service;
  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
  ) {}

  async ucanToken(args: {
    user: Brand;
    authType: 'ucan'|'key';
    ucanToken: string;
  }) {
    if (!args.user.did) {
        throw new HttpException("DIDNotFound", 400);
    }
    this.serviceUcan = await Service.fromPrivateKey(process.env.UCAN_PRIVATE_KEY)

    if (args.authType === 'ucan') {
      return {
        success: 'Y',
        status: 200,
        value: await this.serviceUcan.refresh(args.ucanToken, args.user.did),
      }
    }

    if (args.authType === 'key') {
      return {
        success: 'Y',
        status: 200,
        value: await this.serviceUcan.ucan(args.user.did),
      }
    }

    return {
      success: 'N',
      status: 400,
      error: {
        code: 'ERROR_UNSUPPORTED_AUTH_METHOD',
        message: 'Session auth is not supported in this endpoint.',
      },
    }
  }
}