import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { billingApi } from '../api/client';
import { ShieldIcon } from '../components/icons/PolicyIcons';

interface Invoice {
  id: number;
  policyNumber: string;
  amountDue: number;
  dueDate: string;
  status: string;
}

export default function Billing() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadInvoices() {
    setLoading(true);
    try {
      const res = await billingApi.get('/api/billing/invoices');
      setInvoices(res.data);
    } catch (err) {
      setError('Could not load invoices. Is billing-service running?');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadInvoices(); }, []);

  async function payInvoice(id: number) {
    try {
      await billingApi.post(`/api/billing/invoices/${id}/pay`);
      await loadInvoices();
    } catch (err) {
      setError('Could not process payment.');
    }
  }

  return (
    <>
      <h1 className="page-title">Billing</h1>
      <p className="page-subtitle">Invoices are created automatically by billing-service when a policy is issued.</p>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <p className="empty-state">Loading...</p>
      ) : invoices.length === 0 ? (
        <p className="empty-state">No invoices yet. Create a policy first.</p>
      ) : (
        <div className="ledger">
          <AnimatePresence>
            {invoices.map((inv, i) => (
              <motion.div
                className="ledger-row with-icon"
                key={inv.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
              >
                <div className="ledger-icon"><ShieldIcon size={34} /></div>
                <div className="row-content">
                  <div className="label">Policy {inv.policyNumber}</div>
                  <div className="primary">Due {inv.dueDate}</div>
                  <div className="amount">${Number(inv.amountDue).toFixed(2)}</div>
                  <div className="meta">
                    <span className={`status-tag ${inv.status.toLowerCase()}`}>{inv.status}</span>
                    {inv.status === 'PENDING' && (
                      <motion.button
                        className="primary" style={{ marginLeft: '1rem', padding: '0.3rem 0.9rem', fontSize: '0.85rem' }}
                        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                        onClick={() => payInvoice(inv.id)}>
                        Mark as paid
                      </motion.button>
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
