import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

export function hashPassword(password) {
  return bcrypt.hashSync(password, 12);
}

export function verifyPassword(password, hashedPassword) {
  return bcrypt.compareSync(password, hashedPassword);
}

export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function getAuthUser(req) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return null;
  
  const decoded = verifyToken(token);
  return decoded;
}

export function requireAuth(handler, requiredRole = null) {
  return async (req, res) => {
    const user = getAuthUser(req);
    
    if (!user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    if (requiredRole && user.type !== requiredRole) {
      return res.status(403).json({ message: `${requiredRole} access required` });
    }
    
    req.user = user;
    return handler(req, res);
  };
}