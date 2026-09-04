CREATE TABLE invoices (
    id BIGSERIAL PRIMARY KEY,
    policy_number VARCHAR(50) NOT NULL,
    owner_email VARCHAR(255) NOT NULL,
    amount_due NUMERIC(14,2) NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_invoices_owner_email ON invoices(owner_email);
