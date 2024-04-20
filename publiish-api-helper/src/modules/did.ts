import axios from "axios";
import { APITOKEN } from "..";

export class Did {
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  public async registerDID(args: {did: string, token:APITOKEN}) {
    try {
      const url = `${this.url}/api/brands/did`;
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
}