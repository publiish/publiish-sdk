import { Env } from ".";
import { IPNSRecord } from "./types";

export class IPNSRecordDO implements DurableObject{
  state: DurableObjectState;

  constructor(state: DurableObjectState, env: Env) {
    this.state = state;
  }

  async fetch(request: Request) {
    const url = new URL(request.url);
    	const pathComponents = url.pathname.split('/').filter(p => p);

		if (pathComponents[0] === "ipns-publish") {
			const [, ipnsName, fileCid] = pathComponents; // Using array destructuring to skip the first item

			const record: IPNSRecord = { ipnsName, fileCid };
			return this.store(record);
		} else if (pathComponents[0] === "ipns-resolve") {
			const [, ipnsName] = pathComponents;
            return this.retrieve(ipnsName);
		}

		return new Response("Endpoint not found", { status: 404 });
  }

  async store(record: IPNSRecord): Promise<Response> {
    await this.state.storage.put(record.ipnsName, record.fileCid);
    return new Response("Record stored successfully");
  }

  async retrieve(ipnsName: string): Promise<Response> {
    const fileCid = await this.state.storage.get<string>(ipnsName);
    if (fileCid) {
      return new Response(JSON.stringify({ ipnsName, fileCid }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response("Record not found", { status: 404 });
    }
  }
}