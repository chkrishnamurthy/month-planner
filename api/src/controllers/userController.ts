import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { seedDefaultCategories } from '../services/categoryService';

export async function getMe(req: Request, res: Response): Promise<void> {
  await seedDefaultCategories(req.user.uid);
  const user = await prisma.user.findUnique({
    where: { id: req.user.uid },
    select: {
      id:          true,
      email:       true,
      displayName: true,
      photoURL:    true,
      lastLoginAt: true,
      createdAt:   true,
      _count: { select: { months: true } },
    },
  });
  res.json({ data: user });
}

export async function listUsers(_req: Request, res: Response): Promise<void> {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id:          true,
      email:       true,
      displayName: true,
      photoURL:    true,
      lastLoginAt: true,
      createdAt:   true,
      _count: { select: { months: true } },
    },
  });
  res.json({ data: users });
}
