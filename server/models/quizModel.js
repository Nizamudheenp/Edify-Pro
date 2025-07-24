const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswerIndex: { type: Number, required: true },
});

const attemptSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  selectedAnswers: [{ type: Number, required: true }],
  score: { type: Number, required: true },
  attemptedAt: { type: Date, default: Date.now }
});

const quizSchema = new mongoose.Schema(
  {
    lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
    questions: [questionSchema],
    attempts: [attemptSchema] 
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quiz', quizSchema);
