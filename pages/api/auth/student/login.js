import { db } from '../../../../lib/db-memory';
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

    // Find student by email
    const student = db.findStudentByEmail(email);

    if (!student) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    if (!verifyPassword(password, student.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken({
      id: student.id,
      type: 'student',
      email: student.email
    });

    res.status(200).json({
      access_token: token,
      user: {
        id: student.id,
        name: student.name,
        email: student.email,
        department: student.department,
        year: student.year,
        created_at: student.created_at
      }
    });
  } catch (error) {
    console.error('Student login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}