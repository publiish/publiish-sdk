import { Controller, Get, Param, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { IpnsService } from "./ipns.service.js";
import { RequestWithUser } from "../auth/types.js";
import { UploadFileDto } from "../file/dto/index.js";
import { CreateKeyDto } from "./dto/index.js";
import { ApikeyGuard } from "../apikey/apikey.guard.js";
@Controller('ipns')
export class IpnsController {
    constructor(private readonly ipnsService: IpnsService) {}

    // @Get()
    // async getHeliaVersion(): Promise<string> {
    //     const helia = await this.ipnsService.getHelia();
    //     return 'Helia is running, PeerId ' + helia.libp2p.peerId.toString();
    // }

    @UseGuards(ApikeyGuard)
    @Post('/keys')
    async createKey(
        @Req() req: RequestWithUser,
    ) {
        const keyResult = await this.ipnsService.createKey({name: req.body.keyName});
        return keyResult;
    }

    // @Get('names')
    // async getIpnsNames() {
        
    // }

    @UseGuards(ApikeyGuard)
    @Post('publish/:keyName/:cid')
    async publishIpns(
        @Req() req: RequestWithUser,
        @Param('keyName') keyName: string,
        @Param('cid') cid: string,
    ) {
        const result = await this.ipnsService.publishIpns({
            keyName: keyName,
            cid: cid
        });
        return result;
    }

    @Get(':ipnsname')
    async resolveIpns(
        @Req() req: RequestWithUser,
        @Param('ipnsname') ipnsname: string,
    ) {
        const result = await this.ipnsService.resolveIpns({
            cid: ipnsname
        });

        return result;
    }
    
}