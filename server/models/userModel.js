const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['student', 'instructor', 'admin'],
    default: 'student'
  },
  isBanned: {
    type: Boolean,default: false
  }

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
