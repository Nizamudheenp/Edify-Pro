const QuizDB = require('../models/quizModel');

exports.addQuiz = async (req, res) => {
  try {
    const { lesson, questions } = req.body;

    const quiz = new QuizDB({ lesson, questions });
    await quiz.save();

    res.status(201).json({ message: 'Quiz created successfully', quiz });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create quiz' });
  }
};

exports.getQuizByLesson = async (req, res) => {
  try {
    const quiz = await QuizDB.findOne({ lesson: req.params.lessonId });
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch quiz' });
  }
};

exports.updateQuiz = async (req, res) => {
  try {
    const updated = await QuizDB.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update quiz' });
  }
};

exports.deleteQuiz = async (req, res) => {
  try {
    await QuizDB.findByIdAndDelete(req.params.id);
    res.json({ message: 'Quiz deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete quiz' });
  }
};

exports.getQuizQuestionsForStudent = async (req, res) => {
  try {
    const quiz = await QuizDB.findOne({ lesson: req.params.lessonId });

    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    const questions = quiz.questions.map(q => ({
      question: q.question,
      options: q.options
    }));

    res.json({ questions });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load quiz questions' });
  }
};

exports.submitQuiz = async (req, res) => {
  try {
    const { selectedAnswers } = req.body;
    const studentId = req.user._id;
    const lessonId = req.params.lessonId;

    const quiz = await QuizDB.findOne({ lesson: lessonId });

    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    const alreadyAttempted = quiz.attempts.find(a => a.student.toString() === studentId.toString());
    if (alreadyAttempted) {
      return res.status(400).json({ message: 'You already submitted this quiz' });
    }

    let score = 0;
    quiz.questions.forEach((q, i) => {
      if (q.correctAnswerIndex === selectedAnswers[i]) {
        score++;
      }
    });

    quiz.attempts.push({
      student: studentId,
      selectedAnswers,
      score
    });

    await quiz.save();
    res.json({ message: 'Quiz submitted', score });
  } catch (err) {
    res.status(500).json({ message: 'Quiz submission failed' });
  }
};

exports.getQuizResult = async (req, res) => {
  try {
    const lessonId = req.params.lessonId;
    const studentId = req.user._id;

    const quiz = await QuizDB.findOne({ lesson: lessonId });
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    const attempt = quiz.attempts.find(a => a.student.toString() === studentId.toString());
    if (!attempt) {
      return res.status(404).json({ message: 'No quiz attempt found' });
    }

    res.json({
      score: attempt.score,
      attemptedAt: attempt.attemptedAt,
      selectedAnswers: attempt.selectedAnswers
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch quiz result' });
  }
};
