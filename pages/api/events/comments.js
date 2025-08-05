import { db, initDatabase } from '../../../lib/db-postgres';
import { requireAuth } from '../../../lib/auth';

let dbInitialized = false;

export default async function handler(req, res) {
  // Force database initialization every time to ensure comments table exists
  try {
    await initDatabase();
    console.log('Database initialized for comments API');
  } catch (error) {
    console.error('Database init error:', error);
  }
  
  const eventId = parseInt(req.query.eventId);
  
  if (!eventId || isNaN(eventId)) {
    return res.status(400).json({ message: 'Valid eventId is required' });
  }

  if (req.method === 'GET') {
    return getComments(req, res, eventId);
  } else if (req.method === 'POST') {
    return requireAuth(addComment)(req, res, eventId);
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}

async function getComments(req, res, eventId) {
  try {
    const comments = await db.getEventComments(eventId);
    res.status(200).json(comments);
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function addComment(req, res, eventId) {
  try {
    console.log('=== ADD COMMENT DEBUG ===');
    console.log('EventId:', eventId);
    console.log('Request body:', req.body);
    console.log('User:', req.user);
    
    const { comment } = req.body;
    
    if (!req.user) {
      console.log('ERROR: No user found in request');
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const studentId = req.user.id;
    console.log('Student ID:', studentId, 'Type:', typeof studentId);

    if (!comment || comment.trim().length === 0) {
      console.log('ERROR: Empty comment');
      return res.status(400).json({ message: 'Comment cannot be empty' });
    }

    // Allow both students and admins to comment
    // if (req.user.username) {
    //   console.log('ERROR: Admin trying to comment');
    //   return res.status(403).json({ message: 'Only students can comment' });
    // }

    // Validate IDs are numbers
    const validEventId = parseInt(eventId);
    const validStudentId = parseInt(studentId);
    
    console.log('Parsed IDs:', { validEventId, validStudentId });
    
    if (isNaN(validEventId) || isNaN(validStudentId)) {
      console.log('ERROR: Invalid IDs - eventId:', validEventId, 'studentId:', validStudentId);
      return res.status(400).json({ message: 'Invalid event or student ID' });
    }

    console.log('Creating comment with:', {
      event_id: validEventId,
      student_id: validStudentId,
      comment: comment.trim()
    });

    const newComment = await db.createComment({
      event_id: validEventId,
      student_id: validStudentId,
      comment: comment.trim()
    });

    console.log('Comment created successfully:', newComment);
    res.status(201).json(newComment);
  } catch (error) {
    console.error('Add comment error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}