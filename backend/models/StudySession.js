const mongoose = require('mongoose');

const StudySessionSchema = new mongoose.Schema({
  // Link the session to a specific user (optional now, but good to have for growth)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // Can be null if not implementing user accounts yet
  },

  // What topic this session was about (e.g., Math, Writing)
  topic: {
    type: String,
    required: false
  },

  // What type of session (e.g., chat, flashcard, quiz, career)
  sessionType: {
    type: String,
    enum: ['chat', 'flashcard', 'quiz', 'career'],
    default: 'chat'
  },

  // Start and end timestamps
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date,
    default: null
  },

  // Progress marker (could be stages 1–3 like in your server)
  stage: {
    type: Number,
    default: 1
  },

  // Store any AI summary or feedback at the end of a session
  sessionSummary: {
    type: String,
    default: ''
  },

  // Whether the session is completed or still in progress
  isComplete: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('StudySession', StudySessionSchema);
