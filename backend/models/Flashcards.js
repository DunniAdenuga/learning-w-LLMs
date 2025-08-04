// models/Flashcard.js
const mongoose = require('mongoose');

const FlashcardSchema = new mongoose.Schema({
  topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },

  front: { type: String, required: true },  // Question or prompt side
  back: { type: String, required: true },   // Answer or explanation

  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },

  tags: [String], // e.g. ["algebra", "fractions"]

  timesReviewed: { type: Number, default: 0 },
  lastReviewedAt: { type: Date },
  successRate: { type: Number, default: 0 }, // % correct answers if you later add quizzes

  isActive: { type: Boolean, default: true },

}, { timestamps: true }); // adds createdAt and updatedAt automatically

module.exports = mongoose.model('Flashcard', FlashcardSchema);
