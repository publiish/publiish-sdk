import { Controller, Get, Param } from '@nestjs/common';
import { BrandService } from './brand.service';

@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Get('stats/:id')
  getStatistics(@Param('id') id: number): Promise<any> {
    return this.brandService.getStats(id);
  }
}
