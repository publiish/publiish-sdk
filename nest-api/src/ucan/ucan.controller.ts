import { Controller, Post, Req, UseGuards } from "@nestjs/common";
import { UcanService } from "./ucan.service.js";
import { AuthGuard } from "../auth/auth.guard.js";
import { RequestWithUser } from "../auth/types.js";

@Controller('ucan')
export class UcanController {
  constructor(private readonly ucanService: UcanService) {}

  @UseGuards(AuthGuard({checkUcan: true}))
  @Post('token')
  async ucanToken(
    @Req() req: RequestWithUser
  ){
    const { user, auth } = req;
    return await this.ucanService.ucanToken({
      user,
      authType: auth.type,
      ucanToken: auth.ucan.token
    })
  }
}