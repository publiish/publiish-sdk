import { HttpException, Injectable } from "@nestjs/common";
import type { HeliaLibp2p } from 'helia';
import { peerIdFromString } from '@libp2p/peer-id';
import { base36 } from 'multiformats/bases/base36';
import { ipns } from '@helia/ipns';
import { CID } from 'multiformats';
import { ERROR_MESSAGE } from "src/common/error/messages";
import { IpnsPublishResponse } from "./types";

@Injectable()
export class IpnsService {
    private helia?: HeliaLibp2p;

    async getHelia(): Promise<HeliaLibp2p> {
        if (!this.helia) {
          const { createHelia } = await import('helia');
          this.helia = await createHelia();
        }
    
        return this.helia;
    }
    
    async getIpnsNames() {
        const helia = await this.getHelia();

        const keychainKeys = await helia.libp2p.services.keychain.listKeys();

        let keys = keychainKeys.map((k) => {
            const peer = peerIdFromString(k.id)
            return {
              keyName: k.name,
              peerId: peer,
              nameb36: peer.toCID().toString(base36),
            }
        })

    }

    async publishIpns(args: {cid: string}) : Promise<IpnsPublishResponse> {
        try {
            const helia = await this.getHelia();
            const name = ipns(helia);
            
            // create a public key to publish as an IPNS name
            const keyInfo = await helia.libp2p.services.keychain.createKey('my-key', 'Ed25519');
            const peerId = await helia.libp2p.services.keychain.exportPeerId(keyInfo.name)
            
            const cid = CID.parse(args.cid);
            
            await name.publish(peerId, cid);
            
            const result = await name.resolve(peerId)
            return {
                success: 'Y',
                status: 200,
                data: {cid: result.toV1().toString(), path: args.cid},
            };

        } catch (error) {
            console.log('error ', error.message);

            throw new HttpException(ERROR_MESSAGE.FILE_NOT_UPLOADED, 500);
        }
        
    }

    async onApplicationShutdown(): Promise<void> {
        if (this.helia != null) {
            await this.helia.stop();
        }
    }

}