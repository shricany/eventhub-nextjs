import { db } from '../../../lib/db-memory';
import { requireAuth } from '../../../lib/auth';

async function getMyEvents(req, res) {
  try {
    const participations = db.getStudentParticipations(req.user.id);
    const allEvents = db.getAllEvents();
    
    const eventsData = participations.map(participation => {
      const event = allEvents.find(e => e.id === participation.event_id);
      if (event) {
        return {
          ...event,
          my_status: participation.status,
          my_participation_type: participation.participation_type,
          my_feedback: participation.feedback
        };
      }
      return null;
    }).filter(Boolean);
    
    res.status(200).json(eventsData);
  } catch (error) {
    console.error('Get my events error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export default function handler(req, res) {
  if (req.method === 'GET') {
    return requireAuth(getMyEvents, 'student')(req, res);
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}