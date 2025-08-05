import { db, initDatabase } from '../../../../../lib/db-postgres';
import { requireAuth } from '../../../../../lib/auth';

let dbInitialized = false;

export default async function handler(req, res) {
  // Initialize database on first API call
  if (!dbInitialized) {
    await initDatabase();
    dbInitialized = true;
  }
  const { id: eventId } = req.query;

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
    const comments = await db.getEventComments(parseInt(eventId));
    res.status(200).json(comments);
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function addComment(req, res, eventId) {
  try {
    const { comment } = req.body;
    const studentId = req.user.id;

    if (!comment || comment.trim().length === 0) {
      return res.status(400).json({ message: 'Comment cannot be empty' });
    }

    if (req.user.username) {
      return res.status(403).json({ message: 'Only students can comment' });
    }

    const newComment = await db.createComment({
      event_id: parseInt(eventId),
      student_id: studentId,
      comment: comment.trim()
    });

    // Get the comment with user details
    const comments = await db.getEventComments(parseInt(eventId));
    const addedComment = comments.find(c => c.id === newComment.id);

    res.status(201).json(addedComment || newComment);
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}