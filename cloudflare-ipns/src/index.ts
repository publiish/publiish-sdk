/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler deploy src/index.ts --name my-worker` to deploy your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { IPNSRecord } from "./types";

export * from './ipns-do';

export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	IPNS_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
	//
	// Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
	// MY_SERVICE: Fetcher;
	NEST_API_URL: string;
	IPNS_GATEWAY_URL: string;
	IPFS_NODE_URL: string;
}

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext
	): Promise<Response> {
		const url = new URL(request.url);
    	const pathComponents = url.pathname.split('/').filter(p => p);

		if (pathComponents[0] === "ipns-publish") {
			if (pathComponents.length < 3) {
				return new Response("URL must be in the format /ipns-publish/ipns-name/file-cid", { status: 400 });
			}
			const [, ipnsName, fileCid] = pathComponents; // Using array destructuring to skip the first item

			const record: IPNSRecord = { ipnsName, fileCid };
			const id = env.IPNS_DURABLE_OBJECT.idFromName(ipnsName)
			const object = env.IPNS_DURABLE_OBJECT.get(id);

			return object.fetch(request.url);
			
		} else if (pathComponents[0] === "ipns-resolve") {
			if (pathComponents.length !== 2) {
				return new Response("URL must be in the format /ipns-resolve/ipns-name", { status: 400 });
			}
			const [, ipnsName] = pathComponents;

			const id = env.IPNS_DURABLE_OBJECT.idFromName(ipnsName)
			const object = env.IPNS_DURABLE_OBJECT.get(id);
			return object.fetch(request.url);
		}

		return new Response("Endpoint not found", { status: 404 });
	},
};
