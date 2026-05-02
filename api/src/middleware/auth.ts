import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../lib/firebase';
import { prisma } from '../lib/prisma';

export async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) {
    res.status(401).json({ error: 'Missing Authorization header' });
    return;
  }
  try {
    const decoded = await adminAuth.verifyIdToken(token);
    await prisma.user.upsert({
      where: { id: decoded.uid },
      update: {
        email:       decoded.email       ?? '',
        displayName: decoded.name        ?? null,
        photoURL:    decoded.picture     ?? null,
        lastLoginAt: new Date(),
      },
      create: {
        id:          decoded.uid,
        email:       decoded.email       ?? '',
        displayName: decoded.name        ?? null,
        photoURL:    decoded.picture     ?? null,
      },
    });
    req.user = { uid: decoded.uid };
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
