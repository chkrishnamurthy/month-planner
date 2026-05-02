import { Router, type IRouter } from 'express';
import { getMe, listUsers } from '../controllers/userController';

const wrap = (fn: Function) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export const userRouter: IRouter = Router();

userRouter.get('/me',    wrap(getMe));
userRouter.get('/',      wrap(listUsers));
