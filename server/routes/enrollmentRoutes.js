const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { enrollCourse, getEnrolledCourses } = require('../controllers/enrollmentController');

const router = express.Router();

router.use(authMiddleware);

router.post('/:courseId', enrollCourse);
router.get('/my-courses', getEnrolledCourses);

module.exports = router;
