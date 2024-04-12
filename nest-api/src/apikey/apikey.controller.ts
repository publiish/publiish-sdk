import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { ApikeyService } from "./apikey.service.js";
import { RequestWithUser } from "../auth/types.js";
import { AuthGuard } from "../auth/auth.guard.js";
import { ApikeyDto } from "./dto/index.js";

@Controller('apikey')
export class ApikeyController {
  constructor(private readonly apikeyService: ApikeyService) {}

  @UseGuards(AuthGuard)
  @Get()
  getApiKeys(
    @Req() {user}: RequestWithUser
  ) {
    return this.apikeyService.findApiKeysByBrandId(user.id);
  }

  @UseGuards(AuthGuard)
  @Post()
  createApiKey(
    @Req() {user}: RequestWithUser,
    @Body() body: ApikeyDto,
  ){
    const {isDefault, storageSize, expireAt, writePermission, deletePermission} = body;
    return this.apikeyService.createApikey({
      brandId: user.id,
      storageSize,
      expireAt: new Date(expireAt),
      isDefault,
      writePermission,
      deletePermission
    })
  }

  @UseGuards(AuthGuard)
  @Delete(':apikey')
  deleteApiKey(
    @Req() {user}: RequestWithUser,
    @Param('apikey') apikey: string
  ) {
    return this.apikeyService.deleteApiKeyByBrandId( {
      brandId: user.id,
      apiKey: apikey
    })
  }
}