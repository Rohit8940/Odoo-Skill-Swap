// src/server.js
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes.js';   // ← routes

dotenv.config();

// 1️⃣ create the app
const app = express();

// 2️⃣ global middleware
app.use(cors());
app.use(express.json());

// 3️⃣ mount routes
app.use('/api/auth', authRoutes);

// 4️⃣ (OPTIONAL) simple health check
app.get('/', (req, res) => res.send('API is running'));

// 5️⃣ connect DB then listen
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`🚀  http://localhost:${PORT}`));
  })
  .catch((err) => console.error('DB connection error:', err));
