import express from 'express';
import {
  getQuestionsByTestId,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  reorderQuestions,
  getQuestionsForAttempt,
  createMultipleQuestions
} from '../controllers/question.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Защищенные маршруты
router.get('/test/:testId', protect, getQuestionsByTestId);
// router.post('/test/:testId', protect, createQuestion); // добавить толко один вопросов
router.post('/test/:testId', protect, createMultipleQuestions); // добавить коллекция вопросов
router.put('/:id', protect, updateQuestion);
router.delete('/:id', protect, deleteQuestion);
router.post('/reorder', protect, reorderQuestions);

// Маршруты для прохождения теста
router.get('/attempt/:testId', getQuestionsForAttempt);

export default router;