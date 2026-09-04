# notification-service

Node.js service that listens to `policy.created`, `claim.submitted`, and `claim.scored`
Kafka topics and sends (mock) email notifications. No database of its own — fully stateless.

## Run locally
```bash
npm install
cp .env.example .env
npm run dev
```

## Production upgrade path
Replace the body of `src/channels/emailChannel.js` with a real AWS SES call —
nothing else in this service changes.
