import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brand } from "../brand/brand.entity.js";
import { Repository } from "typeorm";
import { Apikey } from "./apikey.entity.js";
import { JwtService } from "@nestjs/jwt";
import { ApikeysResponse } from "./types.js";

@Injectable()
export class ApikeyService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
    @InjectRepository(Apikey)
    private apikeyRepository: Repository<Apikey>,
  ) {}

  async createApikey( args: {
    brandId: number,
    isDefault?: boolean,
    storageSize?: number,
    expireAt?: Date,
    writePermission?: boolean,
    deletePermission?: boolean,
  }) {
    try {
      const brand = await this.brandRepository.findOne({where: {id: args.brandId}});
      if (!brand) {
        throw new NotFoundException(`Brand with ID "${args.brandId}" not found.`);
      }

      const apiKeyString = await this.jwtService.signAsync({
        brandId: args.brandId,
        isDefault: args.isDefault ?? false,
        storageSize: args.storageSize ?? 0,
      }, { 
        expiresIn: args.expireAt? "90d": undefined 
      });

      const apiKey = this.apikeyRepository.create({
        apikey: apiKeyString,
        ...args,
        brand: brand,
      });
      
      await this.apikeyRepository.save(apiKey);
      
      return {
        success: 'Y',
        status: 200,
        apiKey: apiKeyString,
      }

    } catch (error) {
      return {
        success: 'N',
        status: 200,
        Message: `Something went wrong. error = ${error}`,
      }
    }
  }

  // Delete an API Key
  async deleteApiKey(id: string): Promise<void> {
    const result = await this.apikeyRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`API Key with ID "${id}" not found.`);
    }
  }

  // Delete an API Key
  async deleteApiKeyByBrandId( args: {
    brandId: number,
    apiKey: string,
  }) {
    const result = await this.apikeyRepository.delete( {
        brandId: args.brandId,
        apikey: args.apiKey
    });

    if (result.affected === 0) {
      throw new NotFoundException(`API Key with ID "${args.brandId}" not found.`);
    }

    return {
      success: 'Y',
      status: 200,
      Message: 'Successfully deleted'
    }
  }

  // Optionally, you might want to add a method to find an API Key by ID
  async findApiKeyById(id: string): Promise<Apikey> {
    const apiKey = await this.apikeyRepository.findOne({ where: {id} });
    if (!apiKey) {
      throw new NotFoundException(`API Key with ID "${id}" not found.`);
    }
    return apiKey;
  }

  // Optionally, you might want to add a method to find an API Key by Barand ID
  async findApiKeysByBrandId(brandId: number): Promise<ApikeysResponse> {
    const apiKeys = await this.apikeyRepository.find({ where: { brandId } });
    if (!apiKeys) {
      throw new NotFoundException(`API Key with ID "${brandId}" not found.`);
    }
    return {
      success: 'Y',
      status: 200,
      data: apiKeys
    };
  }
}