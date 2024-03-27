import { Controller, Get, Param, Post, Query, Req, Res } from "@nestjs/common";
import { IpnsService } from "./ipns.service.js";
import { RequestWithUser } from "../auth/types.js";
import { UploadFileDto } from "../file/dto/index.js";
import { CreateKeyDto } from "./dto/index.js";
@Controller('ipns')
export class IpnsController {
    constructor(private readonly ipnsService: IpnsService) {}

    // @Get()
    // async getHeliaVersion(): Promise<string> {
    //     const helia = await this.ipnsService.getHelia();
    //     return 'Helia is running, PeerId ' + helia.libp2p.peerId.toString();
    // }

    @Post('/keys')
    async createKey(
        @Req() req: RequestWithUser,
        @Query() { name }: CreateKeyDto,
    ) {
        const keyResult = await this.ipnsService.createKey({name: name});
        return keyResult;
    }

    // @Get('names')
    // async getIpnsNames() {
        
    // }

    @Post('publish/:keyName/:cid')
    async publishIpns(
        @Req() req: RequestWithUser,
        @Param('keyName') keyName: string,
        @Param('cid') cid: string,
        @Query() { brand_id, auth_user_id }: UploadFileDto,
    ) {
        const result = await this.ipnsService.publishIpns({
            keyName: keyName,
            cid: cid
        });
        console.log('11111111', result);
        return result;

    }
    
}