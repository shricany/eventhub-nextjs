import { requireAuth } from '../../lib/auth';

async function debugUser(req, res) {
  res.status(200).json({
    user: req.user,
    userKeys: Object.keys(req.user),
    userId: req.user.id,
    userType: typeof req.user.id
  });
}

export default function handler(req, res) {
  return requireAuth(debugUser, 'student')(req, res);
}