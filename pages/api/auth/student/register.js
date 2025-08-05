import { db } from '../../../../lib/db-memory';
import { hashPassword, generateToken } from '../../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, password, department, year } = req.body;

    if (!name || !email || !password || !department || !year) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if student already exists
    if (db.findStudentByEmail(email)) {
      return res.status(400).json({ message: 'Student already exists' });
    }

    // Hash password
    const hashedPassword = hashPassword(password);

    // Create student
    const student = db.createStudent({
      name,
      email,
      password: hashedPassword,
      department,
      year: parseInt(year)
    });

    // Generate JWT token
    const token = generateToken({
      id: student.id,
      type: 'student',
      email: student.email
    });

    res.status(201).json({
      access_token: token,
      user: student
    });
  } catch (error) {
    console.error('Student registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}