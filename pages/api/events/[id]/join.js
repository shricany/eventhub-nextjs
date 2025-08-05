import { db } from '../../../../lib/db-postgres';
import { requireAuth } from '../../../../lib/auth';

async function joinEvent(req, res) {
  try {
    const { id: eventId } = req.query;
    const studentId = req.user.id;
    const { participation_type = 'participant' } = req.body;

    const existing = await db.findParticipation(studentId, parseInt(eventId));
    
    if (existing) {
      await db.updateParticipation(studentId, parseInt(eventId), { 
        status: 'joined',
        participation_type 
      });
    } else {
      await db.createParticipation({
        student_id: studentId,
        event_id: parseInt(eventId),
        status: 'joined',
        participation_type
      });
    }
    
    res.status(200).json({ message: 'Successfully joined event' });
  } catch (error) {
    console.error('Join event error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export default function handler(req, res) {
  if (req.method === 'POST') {
    return requireAuth(joinEvent, 'student')(req, res);
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}