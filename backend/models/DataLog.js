// models/DataLog.js
const mongoose = require('mongoose');

const DataLogSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudySession',
    required: true
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Optional: if multi-user support is present
  },

  type: {
    type: String,
    enum: ['chat', 'flashcard', 'quiz', 'navigation', 'system'],
    required: true
  },

  detail: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    // Flexible object: e.g. { question: "", userAnswer: "", correct: true }
  },

  timestamp: {
    type: Date,
    default: Date.now
  }

}, { timestamps: true });

module.exports = mongoose.model('DataLog', DataLogSchema);


const DataLog = require('./models/DataLog');

await DataLog.create({
  sessionId: session._id,
  type: 'flashcard',
  detail: {
    flashcardId: interaction.flashcardId,
    correct: interaction.correct,
    responseTimeMs: interaction.responseTimeMs
  }
});


