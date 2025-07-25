const express = require('express');
const router = express.Router();

const { authMiddleware, authorizeRoles } = require('../middlewares/authMiddleware');
const {
  getAllCourses,
  updateCourseStatus,
  getPlatformStats,
  getAllUsers,
  updateUserStatus
} = require('../controllers/adminController');

router.use(authMiddleware, authorizeRoles('admin'));

router.get('/courses', getAllCourses);             
router.put('/course/:id/status', updateCourseStatus);  
router.get('/stats', getPlatformStats);             
router.get('/users', getAllUsers);
router.put('/user/:id/status', updateUserStatus);

module.exports = router;
