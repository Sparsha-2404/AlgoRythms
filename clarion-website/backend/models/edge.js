const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EdgeSchema = new Schema({
  source: {
    type: Schema.Types.ObjectId,
    ref: 'Node',
    required: [true, 'Source node is required']
  },
  target: {
    type: Schema.Types.ObjectId,
    ref: 'Node',
    required: [true, 'Target node is required']
  },
  type: {
    type: String,
    default: 'related',
    trim: true
  },
  weight: {
    type: Number,
    default: 1,
    min: 0,
    max: 10
  },
  bidirectional: {
    type: Boolean,
    default: true
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
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure no duplicate edges between the same nodes with the same type
EdgeSchema.index({ source: 1, target: 1, type: 1 }, { unique: true });

// Update the 'updatedAt' field on save
EdgeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Edge', EdgeSchema);