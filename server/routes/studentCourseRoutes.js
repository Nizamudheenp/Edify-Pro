const express = require('express');
const { getAllPublishedCourses, getPublishedCourseById } = require('../controllers/studentCourseController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();


router.get('/', getAllPublishedCourses);
router.get('/:id',authMiddleware, getPublishedCourseById);

module.exports = router;
