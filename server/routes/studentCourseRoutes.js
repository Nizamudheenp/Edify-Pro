const express = require('express');
const { getAllPublishedCourses, getPublishedCourseById } = require('../controllers/studentCourseController');
const router = express.Router();


router.get('/', getAllPublishedCourses);
router.get('/:id', getPublishedCourseById);

module.exports = router;
