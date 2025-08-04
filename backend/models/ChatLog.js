const mongoose = require('mongoose');

const ChatLogSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudySession',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  isUser: {
    type: Boolean,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },

  // NEW: What type of message is it? Helps categorize interactions
  type: {
    type: String,
    enum: ['text', 'quiz', 'flashcard', 'career', 'system'], // You can expand as needed
    default: 'text'
  },

  // NEW: Add topic info for deeper analytics
  topic: {
    type: String, // or use ObjectId if linking to Topic model
    default: null
  },

  // NEW: Store stage of the learning process (based on your /chat route)
  stage: {
    type: Number,
    default: 1
  },

  // NEW: Track model used (e.g., GPT-4o, GPT-3.5)
  aiModel: {
    type: String,
    default: 'gpt-4o-mini'
  }
});

module.exports = mongoose.model('ChatLog', ChatLogSchema);
