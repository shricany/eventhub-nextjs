import { initDatabase } from '../../lib/db-postgres';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await initDatabase();
      res.status(200).json({ message: 'Database initialized successfully' });
    } catch (error) {
      console.error('Database initialization error:', error);
      res.status(500).json({ message: 'Database initialization failed', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}