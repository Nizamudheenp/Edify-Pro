const express = require('express');
const router = express.Router();
const { authMiddleware, authorizeRoles } = require('../middlewares/authMiddleware');
const { submitAssignment, createAssignment, getSubmissions, gradeSubmission } = require('../controllers/assignmentController');
const { uploadAssignment } = require('../utils/multer');


// Student 
router.post(
  '/submit/:assignmentId',
  authMiddleware,
  authorizeRoles('student'),
  uploadAssignment.single('file'),
  submitAssignment
);

// Instructor 

router.use(authMiddleware, authorizeRoles('instructor'));

router.post('/', createAssignment);
router.get('/submissions/:assignmentId', getSubmissions);
router.put('/grade/:assignmentId/:studentId', gradeSubmission);

module.exports = router;
