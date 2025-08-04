// models/Quiz.js
const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
  topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' },
  question: String,
  correctAnswer: String
});

module.exports = mongoose.model('Quiz', QuizSchema);
