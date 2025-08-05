import { db, initDatabase } from '../../../../lib/db-postgres';
import { requireAuth } from '../../../../lib/auth';

let dbInitialized = false;

export default async function handler(req, res) {
  if (!dbInitialized) {
    await initDatabase();
    dbInitialized = true;
  }

  if (req.method === 'DELETE') {
    return requireAuth(deleteComment)(req, res);
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}

async function deleteComment(req, res) {
  try {
    const { commentId } = req.query;

    if (!req.user.username) {
      return res.status(403).json({ message: 'Only admins can delete comments' });
    }

    if (!commentId) {
      return res.status(400).json({ message: 'Comment ID is required' });
    }

    await db.deleteComment(parseInt(commentId));
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}