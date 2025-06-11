import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  selectedOptions: [mongoose.Schema.Types.Mixed],
  textAnswer: {
    type: String
  },
  isCorrect: {
    type: Boolean
  },
  points: {
    type: Number,
    default: 0
  },
  needsManualCheck: {
    type: Boolean,
    default: false
  }
});

const testAttemptSchema = new mongoose.Schema({
  test: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  guestInfo: {
    name: String,
    lastName: String,
    email: String,
    number: String,
    telegram: String
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  answers: [answerSchema],
  totalScore: {
    type: Number,
    default: 0
  },
  percentage: {
    type: Number,
    default: 0
  },
  isPassed: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['inProgress', 'completed', 'needsReview', 'reviewed'],
    default: 'inProgress'
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

const TestAttempt = mongoose.model('TestAttempt', testAttemptSchema);

export default TestAttempt;