/**
 * JWT authentication middleware and token generation.
 */
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || '3SisterCollection_SecretKey_2026!';

/**
 * Express middleware – verifies Bearer token in Authorization header.
 */
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token.' });
    req.user = decoded;
    next();
  });
}

/**
 * Generate a signed JWT for a given admin user (24-hour expiry).
 */
export function generateToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username },
    SECRET,
    { expiresIn: '24h' }
  );
}
