import axios from "axios";
import { Auth } from "./modules/auth";
import { Files } from "./modules/files";
import { Ipns } from "./modules/ipns";
import { Did } from "./modules/did";
import { Ucan } from "./modules/ucan";

export * from "./types/type";

class PubliishApiHelper {
  files: Files;
  ipns: Ipns;
  did: Did;
  ucan: Ucan;
  private auth: Auth;
  private url: string;

  constructor( args: {
    publiishApiUrl: string;
  }) {
    this.url = args.publiishApiUrl;
    this.files = new Files(args.publiishApiUrl);
    this.ipns = new Ipns(args.publiishApiUrl);
    this.auth = new Auth(args.publiishApiUrl);
    this.did = new Did(args.publiishApiUrl);
    this.ucan = new Ucan(args.publiishApiUrl);
  }

  public async getServiceDid() {
    const url = `${this.url}/api/did`;
    const result = await axios.get(url);
      
    return result.data;
  }
}

export default PubliishApiHelper;

export type APITOKEN = string;
export type UCANTOKEN = string;