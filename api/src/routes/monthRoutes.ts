import { Router, type IRouter } from 'express';
import { validate } from '../middleware/validate';
import { saveMonthSchema, getMonth, saveMonth, listMonths, copyMonth } from '../controllers/monthController';

const wrap = (fn: Function) => (req: any, res: any, next: any) => Promise.resolve(fn(req, res, next)).catch(next);

export const monthRouter: IRouter = Router();

monthRouter.get('/',              wrap(listMonths));
monthRouter.get('/:monthId',      wrap(getMonth));
monthRouter.post('/',             validate(saveMonthSchema), wrap(saveMonth));
monthRouter.post('/:monthId/copy', wrap(copyMonth));
