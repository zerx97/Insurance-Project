import { useEffect, useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { policyApi } from '../api/client';
import { categoryIcon } from '../components/icons/PolicyIcons';
import { formatCurrency, formatCoverage } from '../utils/format';

interface Policy {
  id: number;
  policyNumber: string;
  policyType: string;
  coverageAmount: number;
  monthlyPremium: number;
  status: string;
  startDate: string;
  endDate: string;
}

export default function Policies() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [policyType, setPolicyType] = useState('AUTO');
  const [coverageAmount, setCoverageAmount] = useState('10000');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadPolicies() {
    setLoading(true);
    try {
      const res = await policyApi.get('/api/policies/mine');
      setPolicies(res.data);
    } catch (err: any) {
      setError('Could not load policies. Is policy-service running?');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadPolicies(); }, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await policyApi.post('/api/policies', {
        policyType,
        coverageAmount: Number(coverageAmount),
        startDate,
        endDate,
      });
      setShowForm(false);
      await loadPolicies();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Could not create policy.');
    }
  }

  return (
    <>
      <h1 className="page-title">Your policies</h1>
      <p className="page-subtitle">A new policy publishes an event that automatically creates your first invoice.</p>

      {error && <div className="error-banner">{error}</div>}

      <button className="primary" onClick={() => setShowForm((s) => !s)}>
        {showForm ? 'Cancel' : 'New policy'}
      </button>

      {showForm && (
        <form onSubmit={handleCreate} style={{ marginTop: '1.5rem', marginBottom: '2.5rem' }}>
          <label>
            Policy type
            <select value={policyType} onChange={(e) => setPolicyType(e.target.value)}>
              <option value="AUTO">Auto</option>
              <option value="HOME">Home</option>
              <option value="LIFE">Life</option>
              <option value="HEALTH">Health</option>
            </select>
          </label>
          <label>
            Coverage amount (USD)
            <input type="number" min="1" value={coverageAmount} onChange={(e) => setCoverageAmount(e.target.value)} required />
          </label>
          <label>
            Start date
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
          </label>
          <label>
            End date
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
          </label>
          <button className="primary" type="submit">Create policy</button>
        </form>
      )}

      {loading ? (
        <p className="empty-state">Loading...</p>
      ) : policies.length === 0 ? (
        <p className="empty-state">No policies yet. Create your first one above.</p>
      ) : (
        <div className="ledger">
          <AnimatePresence>
            {policies.map((p, i) => (
              <motion.div
                className="ledger-row with-icon"
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
              >
                <div className="ledger-icon">{categoryIcon(p.policyType)}</div>
                <div className="row-content">
                  <div className="label">{p.policyType} · {p.policyNumber}</div>
                  <div className="primary">Coverage {formatCoverage(Number(p.coverageAmount))}</div>
                  <div className="amount">{formatCurrency(Number(p.monthlyPremium))}/mo</div>
                  <div className="meta">
                    {p.startDate} → {p.endDate}
                    <span className={`status-tag ${p.status.toLowerCase()}`} style={{ marginLeft: '0.75rem' }}>
                      {p.status}
                    </span>
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
