import { useEffect, useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { claimsApi } from '../api/client';
import { categoryIcon } from '../components/icons/PolicyIcons';
import { formatCurrency } from '../utils/format';

interface Claim {
  id: number;
  claim_number: string;
  policy_number: string;
  claim_type: string;
  description: string;
  amount_claimed: number;
  status: string;
  fraud_score: number | null;
}

export default function Claims() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [policyNumber, setPolicyNumber] = useState('');
  const [claimType, setClaimType] = useState('AUTO');
  const [description, setDescription] = useState('');
  const [amountClaimed, setAmountClaimed] = useState('1000');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadClaims() {
    setLoading(true);
    try {
      const res = await claimsApi.get('/api/claims/mine');
      setClaims(res.data);
    } catch (err) {
      setError('Could not load claims. Is claims-service running?');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadClaims(); }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await claimsApi.post('/api/claims', {
        policyNumber,
        claimType,
        description,
        amountClaimed: Number(amountClaimed),
      });
      setShowForm(false);
      setDescription('');
      await loadClaims();
    } catch (err: any) {
      setError(err.response?.data?.errors?.[0]?.msg || 'Could not submit claim.');
    }
  }

  return (
    <>
      <h1 className="page-title">Your claims</h1>
      <p className="page-subtitle">
        Submitting a claim sends it to fraud-detection-service for scoring — refresh in a
        few seconds to see the status update from SUBMITTED to APPROVED or UNDER_REVIEW.
      </p>

      {error && <div className="error-banner">{error}</div>}

      <button className="primary" onClick={() => setShowForm((s) => !s)}>
        {showForm ? 'Cancel' : 'File a claim'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem', marginBottom: '2.5rem' }}>
          <label>
            Policy number
            <input value={policyNumber} onChange={(e) => setPolicyNumber(e.target.value)} placeholder="POL-XXXXXXXX" required />
          </label>
          <label>
            Claim type
            <select value={claimType} onChange={(e) => setClaimType(e.target.value)}>
              <option value="AUTO">Auto</option>
              <option value="HOME">Home</option>
              <option value="LIFE">Life</option>
              <option value="HEALTH">Health</option>
            </select>
          </label>
          <label>
            Description
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} minLength={10} required />
          </label>
          <label>
            Amount claimed (USD)
            <input type="number" min="1" value={amountClaimed} onChange={(e) => setAmountClaimed(e.target.value)} required />
          </label>
          <button className="primary" type="submit">Submit claim</button>
        </form>
      )}

      {loading ? (
        <p className="empty-state">Loading...</p>
      ) : claims.length === 0 ? (
        <p className="empty-state">No claims filed yet.</p>
      ) : (
        <div className="ledger">
          <AnimatePresence>
            {claims.map((c, i) => (
              <motion.div
                className="ledger-row with-icon"
                key={c.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
              >
                <div className="ledger-icon">{categoryIcon(c.claim_type)}</div>
                <div className="row-content">
                  <div className="label">{c.claim_type} · {c.claim_number} · policy {c.policy_number}</div>
                  <div className="primary">{c.description}</div>
                  <div className="amount">{formatCurrency(Number(c.amount_claimed))}</div>
                  <div className="meta">
                    <span className={`status-tag ${c.status.toLowerCase()}`}>{c.status}</span>
                    {c.fraud_score !== null && (
                      <span style={{ marginLeft: '0.75rem' }}>Fraud score: {c.fraud_score}</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </>
  );
}
