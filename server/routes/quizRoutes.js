const express = require('express');
const router = express.Router();
const { authMiddleware, authorizeRoles } = require('../middlewares/authMiddleware');
const {
  addQuiz,
  getQuizByLesson,
  updateQuiz,
  deleteQuiz,
  submitQuiz,
  getQuizResult,
  getAllQuizQuestionsForStudent,
} = require('../controllers/quizController');

router.use(authMiddleware);

// Instructor 
router.post('/', authorizeRoles('instructor'), addQuiz);
router.get('/lesson/:lessonId',authorizeRoles('instructor'), getQuizByLesson);
router.put('/:quizId', authorizeRoles('instructor'), updateQuiz);
router.delete('/:quizId', authorizeRoles('instructor'), deleteQuiz);


// Student
router.get('/student/questions/all/:lessonId', authorizeRoles('student'), getAllQuizQuestionsForStudent); 
router.post('/student/submit/:lessonId', authorizeRoles('student'), submitQuiz); 
router.get('/student/result/:lessonId', authorizeRoles('student'), getQuizResult); 

module.exports = router;
