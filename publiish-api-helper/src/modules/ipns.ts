import axios, { AxiosProgressEvent } from "axios";
import { IpnsCreateKeyResponse, IpnsPublishResponse } from "../types/type";

export class Ipns {
  private url: string;
  private apikey: string;

  constructor(url: string, apikey: string) {
    this.url = url;
    this.apikey = apikey;
  }

  public async publish( args: {
    keyName: string;
    cid: string;
  }) : Promise<IpnsPublishResponse> {
    try {
      const url = `${this.url}/api/ipns/publish/${args.keyName}/${args.cid}`;
      const result = await axios.post(url, null, {
        headers: {
          'ApiKey': this.apikey,
        }, 
      });
      
      return result.data;
    } catch(error) {
      throw error;
    }
  }

  public async createKey( args: {
    keyName: string;
  }) : Promise<IpnsCreateKeyResponse> {
    try {
      const url = `${this.url}/api/ipns/keys`;
      const result = await axios.post(url, {"keyName": args.keyName}, {
        headers: {
          'ApiKey': this.apikey,
        }, 
      });

      return result.data;
    } catch(error) {
      throw error;
    }
  }
}