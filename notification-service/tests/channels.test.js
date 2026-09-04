import { test } from 'node:test';
import assert from 'node:assert';
import { sendEmail } from '../src/channels/emailChannel.js';
import { sendSms } from '../src/channels/smsChannel.js';

test('sendEmail resolves with a sent status', async () => {
  const result = await sendEmail('jane@example.com', 'Test subject', 'Test body');
  assert.strictEqual(result.status, 'sent');
  assert.strictEqual(result.channel, 'email');
});

test('sendSms resolves with a sent status', async () => {
  const result = await sendSms('+1-555-0100', 'Test message');
  assert.strictEqual(result.status, 'sent');
  assert.strictEqual(result.channel, 'sms');
});
