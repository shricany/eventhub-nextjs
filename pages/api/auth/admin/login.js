import { db } from '../../../../lib/db-postgres';
import { verifyPassword, generateToken } from '../../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    // Find admin by email
    const admin = await db.findAdminByEmail(email);

    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    if (!verifyPassword(password, admin.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken({
      id: admin.id,
      type: 'admin',
      email: admin.email
    });

    res.status(200).json({
      access_token: token,
      user: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        created_at: admin.created_at
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}