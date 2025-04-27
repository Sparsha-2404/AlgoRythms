const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NodeSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Node title is required'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    required: [true, 'Node type is required'],
    enum: ['question', 'resource', 'project', 'concept'],
    default: 'concept'
  },
  content: {
    type: String,
    default: ''
  },
  metadata: {
    type: Map,
    of: String,
    default: {}
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  contributors: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  visibility: {
    type: String,
    enum: ['public', 'private', 'community'],
    default: 'public'
  },
  tags: [{
    type: String,
    trim: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the 'updatedAt' field on save
NodeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create text indexes for search
NodeSchema.index({ title: 'text', description: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('Node', NodeSchema);