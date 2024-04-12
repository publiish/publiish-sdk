import { Module } from "@nestjs/common";
import { IpnsService } from "./ipns.service.js";
import { IpnsController } from "./ipns.controller.js";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Brand } from "../brand/brand.entity.js";

@Module({
    imports: [TypeOrmModule.forFeature([Brand])],
    controllers: [IpnsController],
    providers: [IpnsService],
  })
  export class IpnsModule {}