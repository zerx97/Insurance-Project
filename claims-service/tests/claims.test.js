import { test } from 'node:test';
import assert from 'node:assert';
import jwt from 'jsonwebtoken';

// A pure unit test with no DB/Kafka dependency — verifies the JWT contract that every
// service in this system relies on (same secret, same "sub"/"role" claim shape).
test('a validly-signed token can be decoded and carries email + role', () => {
  const secret = 'test-secret-key-not-for-production-use-only-testing';
  const token = jwt.sign({ role: 'CUSTOMER' }, secret, { subject: 'jane@example.com', expiresIn: '1h' });

  const decoded = jwt.verify(token, secret);

  assert.strictEqual(decoded.sub, 'jane@example.com');
  assert.strictEqual(decoded.role, 'CUSTOMER');
});

test('a token signed with the wrong secret is rejected', () => {
  const token = jwt.sign({ role: 'CUSTOMER' }, 'wrong-secret', { subject: 'jane@example.com' });
  assert.throws(() => jwt.verify(token, 'test-secret-key-not-for-production-use-only-testing'));
});
