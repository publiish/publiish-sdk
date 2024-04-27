import axios from "axios";
import { KeyPair } from 'publiish-ucan/keypair';
import { build } from 'publiish-ucan/ucan-storage';
import { APITOKEN } from "..";

export class Ucan {
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  public async requestRootUCAN(args: {did: string, token:APITOKEN}) {
    try {
      const url = `${this.url}/api/ucan`;
      const result = await axios.post(url, null, {
        headers: {
          Authorization: `Bearer ${args.token}`,
        }, 
      });
      
      return result.data as {success: 'Y'|'N', status: number, value: string};
    } catch(error) {
      throw error;
    }
  }

  public static async SignRequestUCAN(args: {
    issuer: KeyPair;
    serviceDID: string;
    rootUCAN: string;
    lifeTimeInSecond: number;
  }) {
    return await build({
      issuer: args.issuer,
      audience: args.serviceDID,
      lifetimeInSeconds: args.lifeTimeInSecond,
      capabilities: [
        {
          with: ``,
          can: 'upload/IMPORT',
        },
      ],
      proofs: [args.rootUCAN],
    })
  }
}