import { db } from '../../../../lib/db-memory';
import { requireAuth } from '../../../../lib/auth';

async function submitFeedback(req, res) {
  try {
    const { id: eventId } = req.query;
    const studentId = req.user.id;
    const { feedback } = req.body;

    const participation = db.findParticipation(studentId, parseInt(eventId));
    
    if (participation) {
      db.updateParticipation(studentId, parseInt(eventId), { feedback });
      res.status(200).json({ message: 'Feedback submitted' });
    } else {
      res.status(400).json({ message: 'You must join the event first' });
    }
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export default function handler(req, res) {
  if (req.method === 'POST') {
    return requireAuth(submitFeedback, 'student')(req, res);
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}