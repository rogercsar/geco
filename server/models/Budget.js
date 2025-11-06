const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: [true, 'Please add a project name'],
  },
  clientName: {
    type: String,
    required: [true, 'Please add a client name'],
  },
  projectAddress: {
    type: String,
  },
  projectType: {
    type: String,
  },
  structureType: {
    type: String,
  },
  steps: {
    type: [String],
  },
  materials: {
    type: [Object],
  },
  totalCost: {
    type: Number,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Budget', BudgetSchema);
