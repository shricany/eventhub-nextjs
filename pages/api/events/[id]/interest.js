import { db } from '../../../../lib/db-postgres';
import { requireAuth } from '../../../../lib/auth';

async function showInterest(req, res) {
  try {
    const { id: eventId } = req.query;
    const studentId = req.user.id;

    const existing = await db.findParticipation(studentId, parseInt(eventId));
    
    if (existing) {
      await db.updateParticipation(studentId, parseInt(eventId), { status: 'interested' });
    } else {
      await db.createParticipation({
        student_id: studentId,
        event_id: parseInt(eventId),
        status: 'interested'
      });
    }
    
    res.status(200).json({ message: 'Interest recorded' });
  } catch (error) {
    console.error('Show interest error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function withdrawInterest(req, res) {
  try {
    const { id: eventId } = req.query;
    const studentId = req.user.id;

    const deleted = await db.deleteParticipation(studentId, parseInt(eventId));
    
    if (deleted) {
      res.status(200).json({ message: 'Interest withdrawn' });
    } else {
      res.status(400).json({ message: 'No interest found to withdraw' });
    }
  } catch (error) {
    console.error('Withdraw interest error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export default function handler(req, res) {
  if (req.method === 'POST') {
    return requireAuth(showInterest, 'student')(req, res);
  } else if (req.method === 'DELETE') {
    return requireAuth(withdrawInterest, 'student')(req, res);
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}