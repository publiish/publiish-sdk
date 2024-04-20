import { Module } from "@nestjs/common";
import { UcanController } from "./ucan.controller.js";
import { UcanService } from "./ucan.service.js";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Brand } from "../brand/brand.entity.js";

@Module({
  imports: [TypeOrmModule.forFeature([Brand])],
  controllers: [UcanController],
  providers: [UcanService],
})
  
export class UcanModule {}