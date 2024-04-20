import { Module } from "@nestjs/common";
import { DidController } from "./did.controller.js";

@Module({
  controllers: [DidController],
})
  
export class DidModule {}