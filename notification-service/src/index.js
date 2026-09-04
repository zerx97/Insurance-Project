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
  const MAX_RETRIES = 10;
  const RETRY_DELAY_MS = 5000;

  // The first connection attempt can race a Kafka broker that's technically "up" but hasn't
  // finished auto-creating the topic partitions yet (this is exactly what happened in testing:
  // "This server does not host this topic-partition"). A single try/catch that gives up
  // permanently is a real bug for anything long-running - a proper service retries with backoff
  // instead of silently going deaf for its entire lifetime.
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await startNotificationConsumer();
      console.log('notification-service: connected to Kafka, listening for events');
      break;
    } catch (err) {
      console.error(`Kafka consumer failed to start (attempt ${attempt}/${MAX_RETRIES}): ${err.message}`);
      if (attempt === MAX_RETRIES) {
        console.error('Giving up on Kafka connection after max retries. Restart the container to try again.');
      } else {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      }
    }
  }

  app.listen(PORT, () => console.log(`notification-service listening on port ${PORT}`));
}

start();
