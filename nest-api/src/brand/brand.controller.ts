import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { parse } from 'ucan-storage/did';
import { BrandService } from './brand.service.js';
import { DIDDto, ProfileDto } from './dto/index.js';
import { AuthGuard } from '../auth/auth.guard.js';
import { RequestWithUser } from '../auth/types.js';

@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Get('stats/:id')
  getStatistics(@Param('id') id: number): Promise<any> {
    return this.brandService.getStats(id);
  }

  @UseGuards(AuthGuard)
  @Post()
  updateProfile(
    @Req() { user }: RequestWithUser,
    @Body() body: ProfileDto,
  ) {
    const {brand_name, brand_url, dao_id, sub_domain} = body;
    return this.brandService.updateBrandProfile({
      id: user.id,
      brandName: brand_name,
      brandUrl: brand_url,
      daoId: dao_id ? Number(dao_id) : null,
      subDomain: sub_domain ?? null,
    })
  }

  @UseGuards(AuthGuard)
  @Post('did')
  registerDID(
    @Req() req: RequestWithUser,
    @Body() body: DIDDto
  ) {
    parse(body.did);
    return this.brandService.registerDID({id: req.user.id, did: body.did});
  }
}
