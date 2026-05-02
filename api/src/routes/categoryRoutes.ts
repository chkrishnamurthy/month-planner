import { Router, type IRouter } from 'express';
import { validate } from '../middleware/validate';
import {
  createCategorySchema,
  listCategories,
  createCategory,
  deleteCategory,
} from '../controllers/categoryController';

const wrap = (fn: Function) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export const categoryRouter: IRouter = Router();

categoryRouter.get('/',      wrap(listCategories));
categoryRouter.post('/',     validate(createCategorySchema), wrap(createCategory));
categoryRouter.delete('/:id', wrap(deleteCategory));
