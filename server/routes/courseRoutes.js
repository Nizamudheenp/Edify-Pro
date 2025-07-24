const express = require('express');
const router = express.Router();

const { authMiddleware, authorizeRoles } = require('../middlewares/authMiddleware');
const { createCourse, getInstructorCourses, updateCourse, deleteCourse } = require('../controllers/courseController');

router.use(authMiddleware, authorizeRoles('instructor'));

router.post('/', createCourse);
router.get('/', getInstructorCourses);
router.put('/:id', updateCourse);
router.delete('/:id', deleteCourse);

module.exports = router;
