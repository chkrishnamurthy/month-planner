import { Request, Response } from 'express';
import { z } from 'zod';
import * as monthService from '../services/monthService';

export const saveMonthSchema = z.object({
  monthId:  z.string().regex(/^\d{4}-\d{2}$/, 'monthId must be YYYY-MM'),
  salary:   z.number().min(0).default(0),
  expenses: z.record(z.string(), z.number().min(0)).default({}),
});

export async function getMonth(req: Request, res: Response): Promise<void> {
  const data = await monthService.getMonth(req.user.uid, req.params.monthId);
  res.json({ data: data ?? null });
}

export async function saveMonth(req: Request, res: Response): Promise<void> {
  const data = await monthService.saveMonth(req.user.uid, req.body);
  res.json({ data });
}

export async function listMonths(req: Request, res: Response): Promise<void> {
  const data = await monthService.listMonths(req.user.uid);
  res.json({ data });
}

export async function copyMonth(req: Request, res: Response): Promise<void> {
  const { toMonthId } = z.object({ toMonthId: z.string().regex(/^\d{4}-\d{2}$/) }).parse(req.body);
  const data = await monthService.copyMonth(req.user.uid, req.params.monthId, toMonthId);
  res.json({ data });
}
