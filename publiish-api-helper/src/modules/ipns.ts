import axios, { AxiosProgressEvent } from "axios";
import { IpnsCreateKeyResponse, IpnsPublishResponse } from "../types/type";
import { APITOKEN } from "..";

export class Ipns {
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  public async publish( args: {
    keyName: string;
    cid: string;
    token: APITOKEN;
  }) : Promise<IpnsPublishResponse> {
    try {
      const url = `${this.url}/api/ipns/publish/${args.keyName}/${args.cid}`;
      const result = await axios.post(url, null, {
        headers: {
          Authorization: `Bearer ${args.token}`,
          'ApiKey': args.token,
        }, 
      });
      
      return result.data;
    } catch(error) {
      throw error;
    }
  }

  public async createKey( args: {
    keyName: string;
    token: APITOKEN;
  }) : Promise<IpnsCreateKeyResponse> {
    try {
      const url = `${this.url}/api/ipns/keys`;
      const result = await axios.post(url, {"keyName": args.keyName}, {
        headers: {
          Authorization: `Bearer ${args.token}`,
          'ApiKey': args.token,
        }, 
      });

      return result.data;
    } catch(error) {
      throw error;
    }
  }
}