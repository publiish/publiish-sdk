/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler deploy src/index.ts --name my-worker` to deploy your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
	//
	// Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
	// MY_SERVICE: Fetcher;
}

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext
	): Promise<Response> {
		const url = new URL(request.url);
    	const pathComponents = url.pathname.split('/').filter(p => p);
		console.log('xxx', pathComponents[0]);
		if (pathComponents[0] === "resolve") {
			if (pathComponents.length < 2) {
				return new Response("URL must be in the format /resolve/ipns-hash", { status: 400 });
			}
			const [, ipnsHash] = pathComponents; // Using array destructuring to skip the first item

			const ipfsnodeUrls: string[] = [
				`http://20.222.105.67:5001/api/v0/name/resolve?arg=${ipnsHash}&recursive=true`,
			];
			
			const fetchPromises = ipfsnodeUrls.map(url =>
				fetch(url, {method: 'POST'}).then(response => {
					if (response.ok) return response;
					throw new Error('Not a valid response.');
				})	
			);

			try {
				// Using Promise.any to get the first successful response
				const firstSuccessfulResponse = await Promise.any(fetchPromises);
				// Return the fastest response
				return new Response(firstSuccessfulResponse.body, {
					status: firstSuccessfulResponse.status,
					statusText: firstSuccessfulResponse.statusText,
					headers: firstSuccessfulResponse.headers
				});

			} catch (error) {
				return new Response('Error fetching from IPFS gateways.', {status: 500});
			}
			
		} 

		return new Response("Endpoint not found", { status: 404 });
	},
};
