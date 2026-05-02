import 'dotenv/config';
import express, { type Application } from 'express';
import cors from 'cors';
import { authenticate } from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';
import { monthRouter } from './routes/monthRoutes';
import { userRouter }  from './routes/userRoutes';

const app: Application = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/users',  authenticate, userRouter);
app.use('/months', authenticate, monthRouter);

app.use(errorHandler);

app.listen(PORT, () => console.log(`[api] http://localhost:${PORT}`));
