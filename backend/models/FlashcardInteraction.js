// models/FlashcardInteraction.js
const mongoose = require('mongoose');

const FlashcardInteractionSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudySession',
    required: true
  },

  flashcardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flashcard',
    required: true
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Optional if multi-user support is needed
  },

  correct: {
    type: Boolean,
    required: true
  },

  attempts: {
    type: Number,
    default: 1
  },

  responseTimeMs: {
    type: Number,
    default: 0 // in milliseconds, if you're tracking time to answer
  },

  userAnswer: {
    type: String,
    default: ''
  },

  feedback: {
    type: String, // optional written feedback
    maxlength: 500
  },

  reviewedAt: {
    type: Date,
    default: Date.now
  }

}, { timestamps: true }); // includes createdAt and updatedAt

module.exports = mongoose.model('FlashcardInteraction', FlashcardInteractionSchema);
