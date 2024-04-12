import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from '../brand/brand.entity.js';
import { ApikeyService } from './apikey.service.js';
import { ApikeyController } from './apikey.controller.js';
import { Apikey } from './apikey.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Apikey, Brand])],
  controllers: [ApikeyController],
  providers: [ApikeyService],
})

export class ApikeyModule {}