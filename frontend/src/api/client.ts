import axios from 'axios';

// In production these three would be different subdomains behind CloudFront/ALB path
// routing (e.g. /api/auth/*, /api/policies/*), not three separate ports — this env-var
// setup is purely for local docker-compose development.
const AUTH_BASE = import.meta.env.VITE_AUTH_API || 'http://localhost:8081';
const POLICY_BASE = import.meta.env.VITE_POLICY_API || 'http://localhost:8082';
const BILLING_BASE = import.meta.env.VITE_BILLING_API || 'http://localhost:8083';
const CLAIMS_BASE = import.meta.env.VITE_CLAIMS_API || 'http://localhost:8084';

function withAuth(baseURL: string) {
  const instance = axios.create({ baseURL });
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('insurenext_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  return instance;
}

export const authApi = withAuth(AUTH_BASE);
export const policyApi = withAuth(POLICY_BASE);
export const billingApi = withAuth(BILLING_BASE);
export const claimsApi = withAuth(CLAIMS_BASE);
