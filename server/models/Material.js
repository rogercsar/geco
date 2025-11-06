const mongoose = require('mongoose');

const MaterialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a material name'],
  },
  unit: {
    type: String,
    required: [true, 'Please add a unit'],
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
  },
  category: {
    type: String,
  },
});

module.exports = mongoose.model('Material', MaterialSchema);
