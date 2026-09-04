import 'dotenv/config';
import express from 'express';
import client from 'prom-client';
import { startNotificationConsumer } from './kafka/consumer.js';

const app = express();
const PORT = process.env.PORT || 8085;

client.collectDefaultMetrics();
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

app.get('/health', (req, res) => res.json({ status: 'notification-service is running' }));

async function start() {
  try {
    await startNotificationConsumer();
    console.log('notification-service: connected to Kafka, listening for events');
  } catch (err) {
    console.error('Kafka consumer failed to start (continuing without it):', err.message);
  }
  app.listen(PORT, () => console.log(`notification-service listening on port ${PORT}`));
}

start();
