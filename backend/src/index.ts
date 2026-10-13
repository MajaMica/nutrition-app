import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireAdmin, AuthRequest } from './middleware/auth';
import recipesRouter from './routes/recipes';
import foodsRouter from './routes/foods';
import profileRouter from './routes/profile';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/recipes', recipesRouter);
app.use('/foods', foodsRouter);
app.use('/profile', profileRouter);

app.get('/health', async (req, res) => {
  try {
    const foodCount = await prisma.food.count();
    res.json({
      status: 'ok',
      database: 'connected',
      foods: foodCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: String(error) });
  }
});

app.get('/admin/test', authenticate, requireAdmin, (req: AuthRequest, res) => {
  res.json({
    message: 'Admin access granted!',
    user: req.user,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server radi na http://localhost:${PORT}`);
});