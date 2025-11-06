const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false,
  },
  plan: {
    type: String,
    enum: ['Básico', 'Pro', 'Empresarial'],
    default: 'Básico',
  },
  subscription: {
    mp_preapproval_id: { type: String, default: null },
    period: { type: String, enum: ['mensal', 'semestral', 'anual'], default: null },
    status: { type: String, default: null },
    updatedAt: { type: Date, default: null },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', UserSchema);
