import { HttpException, Injectable } from "@nestjs/common";
import type { HeliaLibp2p } from 'helia';
import { peerIdFromString } from '@libp2p/peer-id';
import { base36 } from 'multiformats/bases/base36';
import { ipns } from '@helia/ipns';
import { CID } from 'multiformats';
import { ERROR_MESSAGE } from "../common/error/messages.js";
import { IpnsKeyResponse, IpnsPublishResponse } from "./types";
import { createHelia } from 'helia'
import { Key as IpnsKey, Name as IpnsName } from '@apillon/ipfs-kubo-rpc-http-client';
@Injectable()
export class IpnsService {

    async createKey (args: {
        name: string
    }) : Promise<IpnsKeyResponse> {
        const ipnsKeyClass = new IpnsKey(process.env.IPFS_API_URL);
        const keyInfo = await ipnsKeyClass.gen({
            name: args.name,
            type: 'Ed25519'
        })

        return {
            success: 'Y',
            status: 200,
            data: {name: keyInfo.Name, id: keyInfo.Id}
        }
    }

    async publishIpns(args: {keyName: string; cid: string}) : Promise<IpnsPublishResponse> {
        const name = new IpnsName(process.env.IPFS_API_URL);

        const cid = CID.parse(args.cid);

        const ipnsEntry = await name.publish({
            cid: cid.toV1().toString(),
            key: undefined,
            resolve: true
        });
        
        return {
            success: 'Y',
            status: 200,
            data: {
                sequence: "",
                path: ipnsEntry.Value, 
                cid: ipnsEntry.Name
            },
        };
        
    }
}

@Injectable()
export class IpnsServiceHelia {
    private helia?: HeliaLibp2p;

    async getHelia(): Promise<HeliaLibp2p> {
        if (!this.helia) {
        //   const { createHelia } = await import('helia');
          
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

    async publishIpns(args: {keyName: string; cid: string}) : Promise<IpnsPublishResponse> {
        try {
            const helia = await this.getHelia();
            const name = ipns(helia);
            
            // create a public key to publish as an IPNS name
            // const keyInfo = await helia.libp2p.services.keychain.createKey('my-key', 'Ed25519');
            // const peerId = await helia.libp2p.services.keychain.exportPeerId(keyInfo.name)

            // fetch a public key
            const keyInfo = await helia.libp2p.services.keychain.findKeyByName(args.keyName);
            const peerId = await helia.libp2p.services.keychain.exportPeerId(keyInfo.name)
            
            const cid = CID.parse(args.cid);
            console.log('cid', cid.toV1().toString());
            //const ipnsCid = await name.resolve(peerId);
            const ipnsEntry = await name.publish(peerId, cid);
            const result = await name.resolve(peerId)

            const keyAsb36Cid = peerIdFromString(keyInfo.id).toCID().toV1().toString();

            return {
                success: 'Y',
                status: 200,
                data: {
                    sequence: ipnsEntry.sequence.toString(),
                    path: result.toV1().toString(), 
                    cid: keyAsb36Cid
                },
            };

        } catch (error) {
            console.log('error ', error);

            throw new HttpException(ERROR_MESSAGE.IPNS_NOT_PUBLISHED, 500);
        }
        
    }

    async createKey (args: {
        name: string
    }) : Promise<IpnsKeyResponse> {
        const helia = await this.getHelia();
        const keyInfo = await helia.libp2p.services.keychain.createKey(args.name, 'Ed25519');
        return {
            success: 'Y',
            status: 200,
            data: {name: keyInfo.name, id: keyInfo.id}
        }
    }

    async onApplicationShutdown(): Promise<void> {
        if (this.helia != null) {
            await this.helia.stop();
        }
    }

}