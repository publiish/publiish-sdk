import { Env } from ".";
import { IPNSRecord } from "./types";

const DAY_IN_SECONDS = 24 * 60 * 60 * 1000;

export class IPNSRecordDO implements DurableObject{
  state: DurableObjectState;
  env: Env;
  constructor(state: DurableObjectState, env: Env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request: Request) {
    const url = new URL(request.url);
    const {searchParams} = url;
    
    const pathComponents = url.pathname.split('/').filter(p => p);

		if (pathComponents[0] === "ipns-publish") {
    
      if(!searchParams.get('auth_user_id') || !searchParams.get('brand_id')) {
        return new Response('no auth_user_id or brand_id', {status: 500});
      }

      const brand_id = searchParams.get('brand_id')?? "".toString();
      const auth_user_id = searchParams.get('auth_user_id')?? "".toString();
			const [, ipnsName, fileCid] = pathComponents; // Using array destructuring to skip the first item

			const record: IPNSRecord = { ipnsName, fileCid };

      const nestapiUrl = `${this.env.NEST_API_URL}/ipns/publish/${ipnsName}/${fileCid}?brand_id=${brand_id}&auth_user_id=${auth_user_id}`;

      try{
        const response = await fetch(nestapiUrl,
          {method:'POST'}
        );

        if (response.status === 200) {
          this.store(record);
        }

			  return new Response(response.body as any, {
					status: response.status,
					statusText: response.statusText,
					headers: response.headers
				});

      } catch(error) {
        return new Response('Error fetching from nest api.', {status: 500});
      }
		} else if (pathComponents[0] === "ipns-resolve") {
			const [, ipnsName] = pathComponents;
            return this.retrieve(ipnsName);
		}

		return new Response("Endpoint not found", { status: 404 });
  }

  async store(record: IPNSRecord): Promise<Response> {
    await this.state.storage.put('ipnsname', record.ipnsName);
    await this.state.storage.put(record.ipnsName, record.fileCid);
    this.state.storage.setAlarm(Date.now() + DAY_IN_SECONDS);

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

  async alarm() {
    const ipnsName = await this.state.storage.get<string>('ipnsname');
    if(!ipnsName) return;
    const fileCid = await this.state.storage.get<string>(ipnsName);
    const nestapiUrl = `${this.env.IPFS_NODE_URL}/name/publish?arg=${fileCid}&key=${ipnsName}`;
    fetch(nestapiUrl, {method:'POST'});
  }
}