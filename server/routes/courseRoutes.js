const express = require('express');
const router = express.Router();

const { authMiddleware, authorizeRoles } = require('../middlewares/authMiddleware');
const { createCourse, getInstructorCourses, updateCourse, deleteCourse } = require('../controllers/courseController');
const { uploadImage } = require('../utils/multer');

router.use(authMiddleware, authorizeRoles('instructor'));

router.post('/',  uploadImage.single('thumbnail'), createCourse);
router.get('/', getInstructorCourses);
router.put('/:id',  uploadImage.single('thumbnail'),  updateCourse);
router.delete('/:id', deleteCourse);

module.exports = router;
