const express = require('express');
const router = express.Router();
const { authMiddleware, authorizeRoles } = require('../middlewares/authMiddleware');
const {
  addQuiz,
  getQuizByLesson,
  updateQuiz,
  deleteQuiz,
  getQuizQuestionsForStudent,
  submitQuiz,
  getQuizResult,
} = require('../controllers/quizController');

router.use(authMiddleware);

// Instructor Routes
router.post('/', authorizeRoles('instructor'), addQuiz);
router.get('/lesson/:lessonId',authorizeRoles('instructor'), getQuizByLesson);
router.put('/:quizId', authorizeRoles('instructor'), updateQuiz);
router.delete('/:quizId', authorizeRoles('instructor'), deleteQuiz);


// Student Route
router.get('/student/questions/:lessonId', authorizeRoles('student'), getQuizQuestionsForStudent); 
router.post('/student/submit/:lessonId', authorizeRoles('student'), submitQuiz); 
router.get('/student/result/:lessonId', authorizeRoles('student'), getQuizResult); 

module.exports = router;
