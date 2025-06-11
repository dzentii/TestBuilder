import express from 'express';
import * as testController from '../controllers/test.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Маршруты для тестов с защитой авторизации
router.get('/', protect, testController.getTests);
router.post('/', protect, testController.createTest);
router.get('/:id', testController.getTestById);
router.put('/:id', protect, testController.updateTest);
router.delete('/:id', protect, testController.deleteTest);
router.put('/:id/publish', protect, testController.publishTest);

// Публичный маршрут без защиты
router.get('/public/:id', testController.getPublicTestById);

export default router;