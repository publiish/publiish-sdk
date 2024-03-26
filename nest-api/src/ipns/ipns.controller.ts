import { Controller, Get, Param, Post, Query, Req, Res } from "@nestjs/common";
import { IpnsService } from "./ipns.service";
import { RequestWithUser } from "src/auth/types";
import { UploadFileDto } from "src/file/dto";

@Controller('ipns')
export class IpnsController {
    constructor(private readonly ipnsService: IpnsService) {}

    @Get()
    async getHeliaVersion(): Promise<string> {
        const helia = await this.ipnsService.getHelia();
        return 'Helia is running, PeerId ' + helia.libp2p.peerId.toString();
    }

    // @Get('names')
    // async getIpnsNames() {
        
    // }

    @Post('publish/:cid')
    async publishIpns(
        @Req() req: RequestWithUser,
        @Param('cid') cid: string,
        @Query() { brand_id, auth_user_id }: UploadFileDto,
        @Res() res: Response
    ) {
        return await this.ipnsService.publishIpns({
            cid: cid
        });

    }
    
}