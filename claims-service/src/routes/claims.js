import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import { pool } from '../db/pool.js';
import { requireAuth } from '../middleware/auth.js';
import { publishClaimSubmitted } from '../kafka/producer.js';

const router = Router();

function generateClaimNumber() {
  return 'CLM-' + Math.random().toString(36).substring(2, 10).toUpperCase();
}

router.post(
  '/',
  requireAuth,
  [
    body('policyNumber').notEmpty().withMessage('policyNumber is required'),
    body('claimType').isIn(['AUTO', 'HOME', 'LIFE', 'HEALTH']).withMessage('invalid claimType'),
    body('description').isLength({ min: 10 }).withMessage('description must be at least 10 characters'),
    body('amountClaimed').isFloat({ gt: 0 }).withMessage('amountClaimed must be a positive number'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const claimNumber = generateClaimNumber();
    const { policyNumber, claimType, description, amountClaimed } = req.body;
    const ownerEmail = req.user.email;

    try {
      const result = await pool.query(
        `INSERT INTO claims (claim_number, policy_number, owner_email, claim_type, description, amount_claimed, status)
         VALUES ($1, $2, $3, $4, $5, $6, 'SUBMITTED') RETURNING *`,
        [claimNumber, policyNumber, ownerEmail, claimType, description, amountClaimed]
      );
      const claim = result.rows[0];

      // Publish AFTER the DB commit succeeds, not before — never publish an event for
      // something that might not actually be saved. This ordering matters more than it looks.
      await publishClaimSubmitted(claim);

      res.status(201).json(claim);
    } catch (err) {
      req.log.error(err, 'Failed to create claim');
      res.status(500).json({ error: 'Failed to submit claim' });
    }
  }
);

router.get('/mine', requireAuth, async (req, res) => {
  const result = await pool.query(
    'SELECT * FROM claims WHERE owner_email = $1 ORDER BY created_at DESC',
    [req.user.email]
  );
  res.json(result.rows);
});

router.get(
  '/:claimNumber',
  requireAuth,
  [param('claimNumber').notEmpty()],
  async (req, res) => {
    const result = await pool.query('SELECT * FROM claims WHERE claim_number = $1', [req.params.claimNumber]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Claim not found' });
    }
    res.json(result.rows[0]);
  }
);

export default router;
