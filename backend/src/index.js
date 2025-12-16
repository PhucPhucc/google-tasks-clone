import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import authRoute from './routers/authRoute.js';
import listTaskRoute from './routers/listTaskRoute.js';
import taskRoute from './routers/taskRoute.js';
import profileRoute from './routers/profileRoute.js';
import requireAuth from './middlewares/authMiddleware.js';
import { connectDB } from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Public routes
app.use('/api/auth', authRoute);

// Private routes
app.use(requireAuth);
app.use('/api/list', listTaskRoute);
app.use('/api/tasks', taskRoute);
app.use('/api/profile', profileRoute);
app.get('/test', (req, res) => {
  const user = req.user;
  res.status(200).json(user);
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
