const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  metadata: {
    service: String,
    intent: String,
    confidence: Number
  }
});

const chatHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  messages: [chatMessageSchema],
  context: {
    userLocation: String,
    previousTopics: [String],
    userProfile: {
      businessType: String,
      servicesInterested: [String]
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
chatHistorySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for faster queries
chatHistorySchema.index({ sessionId: 1 });
chatHistorySchema.index({ userId: 1 });
chatHistorySchema.index({ createdAt: -1 });

module.exports = mongoose.model('ChatHistory', chatHistorySchema);
