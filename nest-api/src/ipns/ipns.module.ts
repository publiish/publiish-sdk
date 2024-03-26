import { Module } from "@nestjs/common";
import { IpnsService } from "./ipns.service";
import { IpnsController } from "./ipns.controller";

@Module({
    imports: [],
    controllers: [IpnsController],
    providers: [IpnsService],
  })
  export class IpnsModule {}