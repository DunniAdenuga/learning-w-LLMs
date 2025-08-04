// models/QuizAttempt.js
const mongoose = require('mongoose');

const QuizAttemptSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'StudySession' },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
  userAnswer: String,
  isCorrect: Boolean,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('QuizAttempt', QuizAttemptSchema);
