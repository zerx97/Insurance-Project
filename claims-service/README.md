# claims-service

Node.js / Express service handling claim submission and status.
Publishes `claim.submitted` to Kafka (consumed by fraud-detection-service) and
listens for `claim.scored` (published by fraud-detection-service) to update claim status.

## Run locally
```bash
npm install
cp .env.example .env
npm run dev
```

## Run tests
```bash
npm test
```

## Endpoints
- `POST /api/claims` — submit a claim
- `GET /api/claims/mine` — list the logged-in user's claims
- `GET /api/claims/:claimNumber` — get one claim
- `GET /health`, `GET /health/ready` — liveness/readiness probes
- `GET /metrics` — Prometheus metrics
