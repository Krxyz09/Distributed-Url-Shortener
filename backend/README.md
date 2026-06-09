# URL Shortener — Backend

Node.js + Express + MongoDB Atlas.

## Setup

```bash
npm install
cp .env.example .env
# paste your MongoDB Atlas connection string into MONGODB_URI
npm start
```

Server runs at http://localhost:4000.

## Endpoints

- `POST /api/shorten` — body `{ "longUrl": "https://..." }` → `{ slug, shortUrl }`
- `GET /:slug` — 302 redirect + async click log
- `GET /api/urls` — recent 50 links
- `GET /api/analytics/summary` — totals
- `GET /api/analytics/timeseries?bucket=hour|day&range=24h|7d|30d&slug=optional`
- `GET /api/analytics/top?limit=10`

## Architecture extension points

- **Redis cache** — `services/cache.js` exposes a Redis-shaped `get/set/del`. Swap the Map for `ioredis` to scale across nodes.
- **Consistent hashing** — when sharding cache to a Redis Cluster, place a hash-ring in front of `cache.js` so slugs map deterministically to shards.
- **Analytics queue** — push `Click` events to a Redis Stream / Kafka topic instead of writing directly, then aggregate in a worker.
- **Horizontal scaling** — the API is stateless; run N replicas behind Nginx / any L7 LB.
