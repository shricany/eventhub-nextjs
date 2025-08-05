import { db, initDatabase } from '../../../lib/db-postgres';
import { requireAuth } from '../../../lib/auth';

let dbInitialized = false;

export default async function handler(req, res) {
  if (!dbInitialized) {
    await initDatabase();
    dbInitialized = true;
  }

  if (req.method === 'DELETE') {
    return requireAuth(deleteEvent)(req, res);
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}

async function deleteEvent(req, res) {
  try {
    console.log('=== DELETE EVENT DEBUG ===');
    console.log('User:', JSON.stringify(req.user, null, 2));
    console.log('Query:', req.query);
    
    const { eventId } = req.query;
    const adminId = req.user.id;

    if (!req.user.username) {
      console.log('ERROR: User has no username field');
      return res.status(403).json({ message: 'Only admins can delete events' });
    }

    if (!eventId) {
      return res.status(400).json({ message: 'Event ID is required' });
    }

    // Check if event exists
    const event = await db.getEventById(parseInt(eventId));
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Admin can delete any event (no ownership check)

    // Delete event (this will cascade delete participations due to foreign key)
    await db.deleteEvent(parseInt(eventId));

    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}