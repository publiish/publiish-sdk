# Cloudflare project for IPNS resloving using Durable Object & IPNS republishing using Durable Object Alarm
- Publish and Resolve ipns records using Durable Object.
- Rebroadcasting IPNS requests to the DHT: Implement an alarm mechanism within the Durable Object instance to trigger the rebroadcasting process every 24 hours.

## How to install
### - Install Wrangler
```
npm install wrangler -g
```

### - Start on local
```
npm run start
```

### - Deploy project to cloudflare
```
wrangler login
npm run deploy
```

## How to use

### - Publishing Ipns
```
curl -X POST "https://<your deployed cloudflare url>/ipns-publish/<ipns-name>/<ipfs file cid>?brand_id=<brand id>&auth_user_id=<auth user id>"
```

### - Resolving Ipns
```
curl -X GET "https://<your deployed cloudflare url>/ipns-resolve/<ipns-name>"
```