import axios from "axios";
import { INamePublishResult, ClientError, INameResoveResult } from "./types.js";

export class Name {
  private url: string;
  constructor(url: string) {
    this.url = url;
  }

  public async publish(params: {
    cid: string;
    key: string;
    resolve: boolean;
    ttl?: string;
  }): Promise<INamePublishResult> {
    let urlParameters = ``;
    urlParameters += params.key ? `&key=${params.key}` : "&key=self";
    urlParameters += params.resolve ? `&resolve=true` : "&resolve=false";
    urlParameters += params.ttl ? `&ttl=${params.ttl}` : "";

    try {
      const res = await axios.post(
        `${this.url}/name/publish?arg=${params.cid}${urlParameters}`
      );
      return res.data;
    } catch (err) {
      throw new ClientError(err);
    }
  }

  public async resolve(params: {
    cid: string;
    recursive: boolean;
    ttl?: string;
  }): Promise<INameResoveResult> {
    let urlParameters = ``;
    urlParameters += params.recursive ? `&recursive=true` : "&recursive=false";
    urlParameters += params.ttl ? `&ttl=${params.ttl}` : "";

    try {
      const res = await axios.post(
        `${this.url}/name/resolve?arg=${params.cid}${urlParameters}`
      );
      return res.data;
    } catch (err) {
      throw new ClientError(err);
    }
  }
}