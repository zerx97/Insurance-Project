import { Kafka } from 'kafkajs';
import { pool } from '../db/pool.js';

const kafka = new Kafka({
  clientId: 'claims-service-consumer',
  brokers: [process.env.KAFKA_BROKERS || 'localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'claims-service' });

// claims-service both PRODUCES "claim.submitted" (for fraud-detection-service to consume)
// and CONSUMES "claim.scored" (published back by fraud-detection-service) — this is a very
// common real-world shape: a request/response pattern built on top of an async event bus,
// instead of claims-service making a blocking HTTP call and waiting on fraud-detection-service.
export async function startClaimScoreConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'claim.scored', fromBeginning: false });
  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const event = JSON.parse(message.value.toString());
        const status = event.fraudScore >= 70 ? 'UNDER_REVIEW' : 'APPROVED';
        await pool.query(
          'UPDATE claims SET fraud_score = $1, status = $2 WHERE claim_number = $3',
          [event.fraudScore, status, event.claimNumber]
        );
        console.log(`Updated claim ${event.claimNumber} -> status=${status}, score=${event.fraudScore}`);
      } catch (err) {
        console.error('Failed to process claim.scored event', err);
      }
    },
  });
}
