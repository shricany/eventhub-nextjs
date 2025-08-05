import { generateToken } from '../../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { username, email, password } = req.body;

    // Hardcoded admin credentials
    const ADMIN_USERNAME = 'admin';
    const ADMIN_EMAIL = 'admin@admin';
    const ADMIN_PASSWORD = 'admin767';

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check hardcoded credentials
    if (username === ADMIN_USERNAME && email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Generate JWT token for hardcoded admin
      const token = generateToken({
        id: 1,
        type: 'admin',
        email: ADMIN_EMAIL,
        username: ADMIN_USERNAME
      });

      res.status(200).json({
        access_token: token,
        user: {
          id: 1,
          username: ADMIN_USERNAME,
          email: ADMIN_EMAIL
        }
      });
    } else {
      res.status(401).json({ message: 'Invalid admin credentials' });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}