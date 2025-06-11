import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  test: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true
  },
  questionText: {
    type: String,
    required: [true, 'Текст вопроса обязателен'],
    trim: true
  },
  questionType: {
    type: String,
    enum: ['singleChoice', 'multipleChoice', 'dropdown', 'matching', 'ordering', 'textInput', 'numberInput', 'fileUpload'],
    required: [true, 'Тип вопроса обязателен']
  },
  options: [mongoose.Schema.Types.Mixed],
  correctAnswer: {
    type: mongoose.Schema.Types.Mixed, // для текстовых и числовых вопросов
  },
  points: {
    type: Number,
    default: 1,
    min: 0
  },
    settings:{
    caseSensitive: { type: Boolean, required: false },
    exactMatch: { type: Boolean, required: false }
},
  orderIndex: {
    type: Number,
    default: 0
  },
  explanation: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Создаем и экспортируем модель
const Question = mongoose.model('Question', questionSchema);

export default Question;