
import express from 'express';
import mongoose from 'mongoose';

import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import { authRoutes } from './routes/auth.routes.js';
import testRoutes from './routes/test.routes.js';
import questionRoutes from './routes/question.routes.js';
import resultRoutes from './routes/result.routes.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://admin:admin@cluster0.gxoi8ej.mongodb.net/')
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/results', resultRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error details:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });
  res.status(500).send({ message: err.message || 'Internal Server Error' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
