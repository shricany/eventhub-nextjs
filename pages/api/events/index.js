import { db } from '../../../lib/db-memory';
import { requireAuth } from '../../../lib/auth';

async function getEvents(req, res) {
  try {
    const events = db.getAllEvents();
    res.status(200).json(events);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function createEvent(req, res) {
  try {
    const { name, date, time, location, department, registration_deadline, award, description } = req.body;

    if (!name || !date || !time || !location || !department || !registration_deadline) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    // Create event
    const event = db.createEvent({
      name,
      date,
      time,
      location,
      department,
      registration_deadline,
      award: award || '',
      description: description || '',
      admin_id: req.user.id
    });

    event.interested_count = 0;
    event.participants_count = 0;

    res.status(201).json(event);
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return getEvents(req, res);
  } else if (req.method === 'POST') {
    return requireAuth(createEvent, 'admin')(req, res);
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}