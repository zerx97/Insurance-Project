import { Kafka } from 'kafkajs';
import { sendEmail } from '../channels/emailChannel.js';

const kafka = new Kafka({
  clientId: 'notification-service',
  brokers: [process.env.KAFKA_BROKERS || 'localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'notification-service' });

// One consumer, subscribed to MULTIPLE topics — notification-service doesn't own any
// business logic, it just reacts to things that already happened elsewhere in the system.
// This is what "notification-service" almost always looks like in a real company: thin,
// stateless, and entirely event-driven.
export async function startNotificationConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topics: ['policy.created', 'claim.submitted', 'claim.scored'], fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const event = JSON.parse(message.value.toString());
      try {
        switch (topic) {
          case 'policy.created':
            await sendEmail(event.ownerEmail, 'Your new policy is active',
              `Policy ${event.policyNumber} (${event.policyType}) is now active. Monthly premium: $${event.monthlyPremium}.`);
            break;
          case 'claim.submitted':
            await sendEmail(event.ownerEmail, 'We received your claim',
              `Claim ${event.claimNumber} for policy ${event.policyNumber} has been received and is being reviewed.`);
            break;
          case 'claim.scored': {
            const outcome = event.fraudScore >= 70 ? 'flagged for manual review' : 'approved for processing';
            await sendEmail(event.ownerEmail, 'Update on your claim',
              `Claim ${event.claimNumber} has been ${outcome}.`);
            break;
          }
        }
      } catch (err) {
        console.error(`Failed to handle event on topic ${topic}`, err);
      }
    },
  });
}
