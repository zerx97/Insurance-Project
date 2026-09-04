import 'dotenv/config';
import express from 'express';
import pinoHttp from 'pino-http';
import client from 'prom-client';
import claimsRouter from './routes/claims.js';
import { initSchema } from './db/pool.js';
import { startClaimScoreConsumer } from './kafka/consumer.js';

const app = express();
const PORT = process.env.PORT || 8084;

app.use(express.json());
app.use(pinoHttp());

// Prometheus metrics: every service in this system exposes /metrics in the same shape,
// regardless of language — Prometheus doesn't care that this one is Node.js and auth-service
// is Java. That consistency is what makes one Grafana dashboard work across a polyglot fleet.
client.collectDefaultMetrics();
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

app.get('/health', (req, res) => res.json({ status: 'claims-service is running' }));
app.get('/health/ready', async (req, res) => {
  // A readiness probe should check real dependencies, not just "is the process alive"
  try {
    const { pool } = await import('./db/pool.js');
    await pool.query('SELECT 1');
    res.json({ status: 'ready' });
  } catch (err) {
    res.status(503).json({ status: 'not ready', error: err.message });
  }
});

app.use('/api/claims', claimsRouter);

app.use((err, req, res, next) => {
  req.log?.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

async function start() {
  await initSchema();
  try {
    await startClaimScoreConsumer();
  } catch (err) {
    console.error('Kafka consumer failed to start (continuing without it):', err.message);
  }
  app.listen(PORT, () => console.log(`claims-service listening on port ${PORT}`));
}

start();
