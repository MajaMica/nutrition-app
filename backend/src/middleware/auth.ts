import { Request, Response, NextFunction } from 'express';
import { supabase } from '../lib/supabase';

export type AuthRequest = Request & {
  user?: {
    id: string;
    email: string;
    role: string;
  };
  file?: Express.Multer.File;
};

export async function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.replace('Bearer ', '');

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const role = (data.user.user_metadata?.role as string) || 'user';

    req.user = {
      id: data.user.id,
      email: data.user.email || '',
      role,
    };

    next();
  } catch (error) {
    return res.status(500).json({ error: 'Auth error' });
  }
}

export function requireAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  next();
}