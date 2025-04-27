// === backend/models/Resource.js ===

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ResourceSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Resource title is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['course', 'book', 'article', 'video', 'documentation', 'project'],
    required: [true, 'Resource type is required']
  },
  tags: [{
    type: String,
    trim: true
  }],
  link: {
    type: String,
    required: [true, 'Resource link is required'],
    trim: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 10
  },
  popularity: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Text search indexing
ResourceSchema.index({ title: 'text', tags: 'text' });

module.exports = mongoose.model('Resource', ResourceSchema);