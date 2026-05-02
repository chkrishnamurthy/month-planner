import { Request, Response } from 'express';
import { z } from 'zod';
import * as categoryService from '../services/categoryService';

export const createCategorySchema = z.object({
  name:  z.string().min(1, 'Name is required').max(30),
  emoji: z.string().min(1).default('📁'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color').default('#8AB4F8'),
});

export async function listCategories(req: Request, res: Response): Promise<void> {
  const data = await categoryService.getCategories(req.user.uid);
  res.json({ data });
}

export async function createCategory(req: Request, res: Response): Promise<void> {
  try {
    const data = await categoryService.createCategory(req.user.uid, req.body);
    res.status(201).json({ data });
  } catch (err) {
    if (err instanceof Error && err.message.includes('already exists')) {
      res.status(409).json({ error: err.message });
      return;
    }
    throw err;
  }
}

export async function deleteCategory(req: Request, res: Response): Promise<void> {
  const deleted = await categoryService.deleteCategory(req.user.uid, req.params.id);
  if (!deleted) { res.status(404).json({ error: 'Category not found' }); return; }
  res.json({ data: { deleted: true } });
}
