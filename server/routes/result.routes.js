import express from 'express';
import * as resultController from '../controllers/result.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Маршруты для прохождения тестов
router.post('/start', resultController.startTestAttempt);
router.post('/:id/submit', resultController.submitTestAttempt);
router.get('/:id', resultController.getAttemptResult);

// Защищенные маршруты для администрирования результатов
router.get('/test/:testId', protect, resultController.getTestResults);
router.post('/:id/review', protect, resultController.reviewAttempt);

export default router;