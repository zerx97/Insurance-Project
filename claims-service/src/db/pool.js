import pg from 'pg';

const { Pool } = pg;

// A connection pool, not a single connection: Node.js is single-threaded for JS execution,
// but I/O (like a DB query) is async — a pool lets many concurrent requests each borrow a
// connection, use it, and give it back, instead of queuing behind one shared connection.
export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'insurenext_claims',
  user: process.env.DB_USER || 'insurenext',
  password: process.env.DB_PASSWORD || 'insurenext',
  max: 10,
  idleTimeoutMillis: 30000,
});

export async function initSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS claims (
      id SERIAL PRIMARY KEY,
      claim_number VARCHAR(50) NOT NULL UNIQUE,
      policy_number VARCHAR(50) NOT NULL,
      owner_email VARCHAR(255) NOT NULL,
      claim_type VARCHAR(50) NOT NULL,
      description TEXT NOT NULL,
      amount_claimed NUMERIC(14,2) NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'SUBMITTED',
      fraud_score NUMERIC(5,2),
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE INDEX IF NOT EXISTS idx_claims_owner_email ON claims(owner_email);
  `);
}
