import { Auth } from "./modules/auth";
import { Files } from "./modules/files";
import { Ipns } from "./modules/ipns";

export * from "./types/type";

class PubliishApiHelper {
  files: Files;
  ipns: Ipns;
  private auth: Auth;

  constructor( args: {
    publiishApiUrl: string;
    apiKey: string;
  }) {
    this.files = new Files(args.publiishApiUrl, args.apiKey);
    this.ipns = new Ipns(args.publiishApiUrl, args.apiKey);
    this.auth = new Auth(args.publiishApiUrl);
  }
}
export default PubliishApiHelper;