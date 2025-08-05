import { db } from '../../../../lib/db-memory';
import { hashPassword, generateToken } from '../../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if admin already exists
    if (db.findAdminByEmail(email) || db.findAdminByUsername(username)) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Hash password
    const hashedPassword = hashPassword(password);

    // Create admin
    const admin = db.createAdmin({
      username,
      email,
      password: hashedPassword
    });

    // Generate JWT token
    const token = generateToken({
      id: admin.id,
      type: 'admin',
      email: admin.email
    });

    res.status(201).json({
      access_token: token,
      user: admin
    });
  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}