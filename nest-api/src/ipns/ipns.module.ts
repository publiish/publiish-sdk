import { Module } from "@nestjs/common";
import { IpnsService } from "./ipns.service.js";
import { IpnsController } from "./ipns.controller.js";

@Module({
    imports: [],
    controllers: [IpnsController],
    providers: [IpnsService],
  })
  export class IpnsModule {}