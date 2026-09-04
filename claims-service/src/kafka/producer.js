import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'claims-service',
  brokers: [process.env.KAFKA_BROKERS || 'localhost:9092'],
  retry: { retries: 5 },
});

const producer = kafka.producer();
let connected = false;

async function ensureConnected() {
  if (!connected) {
    await producer.connect();
    connected = true;
  }
}

// Publishes to the SAME kind of topic pattern the Java services use (policy.created).
// This is the payoff of using Kafka as the event backbone: fraud-detection-service (Python)
// and notification-service (Node) both react to this without claims-service knowing they exist.
export async function publishClaimSubmitted(claim) {
  await ensureConnected();
  await producer.send({
    topic: 'claim.submitted',
    messages: [{
      key: claim.claim_number,
      value: JSON.stringify({
        claimNumber: claim.claim_number,
        policyNumber: claim.policy_number,
        ownerEmail: claim.owner_email,
        claimType: claim.claim_type,
        amountClaimed: Number(claim.amount_claimed),
      }),
    }],
  });
}
