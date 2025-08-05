import { db } from '../../../lib/db-memory';
import { requireAuth } from '../../../lib/auth';

async function getAdminEvents(req, res) {
  try {
    const events = db.getEventsByAdmin(req.user.id);
    res.status(200).json(events);
  } catch (error) {
    console.error('Get admin events error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export default function handler(req, res) {
  if (req.method === 'GET') {
    return requireAuth(getAdminEvents, 'admin')(req, res);
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}