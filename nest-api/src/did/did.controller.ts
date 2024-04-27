import { Controller, Get } from "@nestjs/common";
import { Service } from "publiish-ucan/service";

@Controller('did')
export class DidController {
  @Get()
  async getServiceDID() {
    const serviceUcan = await Service.fromPrivateKey(process.env.UCAN_PRIVATE_KEY)
    return {
      success: 'Y',
      status: 200,
      value: serviceUcan.did()
    }
  }
}