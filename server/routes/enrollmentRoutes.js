const express = require('express');
const { authMiddleware, authorizeRoles } = require('../middlewares/authMiddleware');
const { enrollCourse, getEnrolledCourses, getEnrolledStudents } = require('../controllers/enrollmentController');

const router = express.Router();

router.use(authMiddleware);

router.post('/:courseId',authorizeRoles('student'), enrollCourse);
router.get('/my-courses',authorizeRoles('student'), getEnrolledCourses);
router.get('/instructor/:courseId', authMiddleware, authorizeRoles('instructor'), getEnrolledStudents);

module.exports = router;
