const express = require('express');
const router = express.Router();
const { authMiddleware, authorizeRoles } = require('../middlewares/authMiddleware');
const {
  addLesson,
  getLessons,
  updateLesson,
  deleteLesson,
  getStudentLessons,
  markLessonComplete,
  getCompletedLessons
} = require('../controllers/lessonController');

router.get('/student/:courseId', authMiddleware, authorizeRoles('student'), getStudentLessons);
router.post('/student/:courseId/complete/:lessonId', authMiddleware, authorizeRoles('student'), markLessonComplete);
router.get('/student/:courseId/completed', authMiddleware, authorizeRoles('student'), getCompletedLessons);

router.use(authMiddleware, authorizeRoles('instructor'));
router.post('/:courseId', addLesson);
router.get('/:courseId', getLessons);
router.put('/edit/:id', updateLesson);
router.delete('/delete/:id', deleteLesson);

module.exports = router;
