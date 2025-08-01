const QuizDB = require('../models/quizModel');

exports.addQuiz = async (req, res) => {
  try {
    const { lesson, questions } = req.body;

    if (!lesson || !questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: 'Lesson and questions are required' });
    }

    const quiz = new QuizDB({ lesson, questions });
    await quiz.save();

    res.status(201).json({ message: 'Quiz created successfully', quiz });
  } catch (err) {
    console.error('Add quiz error:', err);
    res.status(500).json({ message: 'Failed to create quiz' });
  }
};


exports.getQuizByLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;

    const quizzes = await QuizDB.find({ lesson: lessonId });

    if (!quizzes || quizzes.length === 0) {
      return res.status(404).json({ message: 'No quizzes found for this lesson' });
    }

    res.status(200).json(quizzes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};



exports.updateQuiz = async (req, res) => {
  try {
    const updated = await QuizDB.findByIdAndUpdate(req.params.quizId, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update quiz' });
  }
};

exports.deleteQuiz = async (req, res) => {
  try {
    await QuizDB.findByIdAndDelete(req.params.quizId);
    res.json({ message: 'Quiz deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete quiz' });
  }
};

exports.getAllQuizQuestionsForStudent = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const studentId = req.user._id;

    const quizzes = await QuizDB.find({ lesson: lessonId });

    const formatted = quizzes.map((quiz) => {
      const alreadyAttempted = quiz.attempts.find(
        (a) => a.student.toString() === studentId.toString()
      );

      return {
        _id: quiz._id,
        attempted: !!alreadyAttempted,
        score: alreadyAttempted?.score || 0,
        questions: quiz.questions.map((q) => ({
          _id: q._id,
          question: q.question,
          options: q.options,
        })),
      };
    });

    res.json({ quizzes: formatted });
  } catch (err) {
    console.error('Quiz Load Error:', err);
    res.status(500).json({ message: 'Failed to load quizzes' });
  }
};


exports.submitQuiz = async (req, res) => {
  try {
    const { selectedAnswers,quizId } = req.body;
    const studentId = req.user._id;
    
    const quiz = await QuizDB.findById(quizId);

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
      total: quiz.questions.length,
      attemptedAt: attempt.attemptedAt,
      selectedAnswers: attempt.selectedAnswers
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch quiz result' });
  }
};
