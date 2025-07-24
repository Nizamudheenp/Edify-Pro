const express = require('express');
const router = express.Router();


const { authMiddleware, authorizeRoles } = require('../middlewares/authMiddleware');
const { addLesson, getLessons, updateLesson, deleteLesson } = require('../controllers/lessonController');

router.use(authMiddleware, authorizeRoles('instructor'));

router.post('/:courseId', addLesson);       
router.get('/:courseId', getLessons);       
router.put('/edit/:id', updateLesson);      
router.delete('/delete/:id', deleteLesson);

module.exports = router;