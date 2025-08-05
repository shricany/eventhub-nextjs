import { db } from '../../../../lib/db-postgres';
import { requireAuth } from '../../../../lib/auth';

async function getEventParticipants(req, res) {
  try {
    const { id: eventId } = req.query;
    const participations = await db.getEventParticipations(parseInt(eventId));
    
    const interested = [];
    const joined = [];
    
    participations.forEach(p => {
      const studentData = {
        id: p.student.id,
        name: p.student.name,
        email: p.student.email,
        department: p.student.department,
        year: p.student.year
      };
      
      if (p.status === 'interested') {
        interested.push(studentData);
      } else if (p.status === 'joined') {
        studentData.participation_type = p.participation_type;
        studentData.feedback = p.feedback;
        joined.push(studentData);
      }
    });
    
    res.status(200).json({
      interested,
      joined
    });
  } catch (error) {
    console.error('Get participants error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export default function handler(req, res) {
  if (req.method === 'GET') {
    return requireAuth(getEventParticipants, 'admin')(req, res);
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}