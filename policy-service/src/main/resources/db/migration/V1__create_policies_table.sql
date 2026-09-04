CREATE TABLE policies (
    id BIGSERIAL PRIMARY KEY,
    policy_number VARCHAR(50) NOT NULL UNIQUE,
    owner_email VARCHAR(255) NOT NULL,
    policy_type VARCHAR(50) NOT NULL,
    coverage_amount NUMERIC(14,2) NOT NULL,
    monthly_premium NUMERIC(14,2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_policies_owner_email ON policies(owner_email);
