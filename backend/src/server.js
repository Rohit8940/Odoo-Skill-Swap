import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import swapRoutes from './routes/swap.routes.js';

const app = express();

app.use([
  cors(),
  helmet(),
  compression(),
  morgan('dev'),
  express.json(),
  rateLimit({ windowMs: 60_000, max: 100 }),
]);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/swaps', swapRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
await connectDB(); // top‑level await is fine in ESM
app.listen(PORT, () => console.log(`🚀 http://localhost:${PORT}`));
