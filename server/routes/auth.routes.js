import express from 'express';
import { register, login, getUserProfile, updateUserProfile } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

export const authRoutes = express.Router();

// Маршруты для авторизации
authRoutes.post('/register', register);
authRoutes.post('/login', login);
authRoutes.get('/profile', protect, getUserProfile);
authRoutes.put('/profile', protect, updateUserProfile);