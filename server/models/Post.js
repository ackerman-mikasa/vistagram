const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    required: true,
    trim: true
  },
  likes: {
    type: Number,
    default: 0
  },
  shares: {
    type: Number,
    default: 0
  },
  likedBy: [{
    type: String // Array of usernames who liked the post
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient querying
postSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Post', postSchema); 