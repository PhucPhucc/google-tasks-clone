import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoute from './routers/authRoute.js';
import requireAuth from './middlewares/authMiddleware.js';

dotenv.config();

// 1. Import kết nối Supabase

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());


// Public routes
app.use('/api/auth', authRoute);

// Private routes
// app.use(requireAuth)
app.get('/test', (req, res) => res.send('test api thành công'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
