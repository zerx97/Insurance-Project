import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'this-is-a-dev-only-secret-replace-in-prod-via-secrets-manager';

// Same shared-secret verification approach as the Java services (JwtAuthFilter.java) —
// this is the piece that has to stay consistent across every language in a polyglot
// system: the TOKEN FORMAT is the contract between services, not the implementation language.
export function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }
  const token = header.substring(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { email: decoded.sub, role: decoded.role };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
