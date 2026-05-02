import 'dotenv/config';
import express, { type Application } from 'express';
import cors from 'cors';
import { authenticate } from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';
import { monthRouter }    from './routes/monthRoutes';
import { userRouter }     from './routes/userRoutes';
import { categoryRouter } from './routes/categoryRoutes';

const app: Application = express();
const PORT = Number(process.env.PORT) || 3001;

const defaultOrigins = ['http://localhost:5173'];
const configuredOrigins = (process.env.CORS_ORIGIN ?? '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowedOrigins = configuredOrigins.length ? configuredOrigins : defaultOrigins;

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser clients (no Origin header), like curl/postman/health checks.
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`Origin not allowed by CORS: ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/users',      authenticate, userRouter);
app.use('/categories', authenticate, categoryRouter);
app.use('/months',     authenticate, monthRouter);

app.use(errorHandler);

app.listen(PORT, () => console.log(`[api] http://localhost:${PORT}`));
