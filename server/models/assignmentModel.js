const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true
  },
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date },
  submissions: [
    {
      student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      fileUrl: { type: String },
      submittedAt: { type: Date, default: Date.now },
      grade: { type: String, default: 'Not graded' }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);
