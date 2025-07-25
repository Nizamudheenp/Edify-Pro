const CourseDB = require('../models/courseModel');
const UserDB = require('../models/userModel');
const EnrollmentDB = require('../models/enrollmentModel');

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await CourseDB.find().populate('instructor', 'name email');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await UserDB.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

exports.updateCourseStatus = async (req, res) => {
  try {
    const course = await CourseDB.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    course.published = req.body.published;
    await course.save();

    res.json({ message: 'Course status updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update course status' });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const user = await UserDB.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isBanned = req.body.isBanned;
    await user.save();

    res.json({ message: `User has been ${user.isBanned ? 'banned' : 'unbanned'} successfully` });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user status' });
  }
};

exports.getPlatformStats = async (req, res) => {
  try {
    const totalUsers = await UserDB.countDocuments();
    const totalCourses = await CourseDB.countDocuments();
    const totalEnrollments = await EnrollmentDB.countDocuments();

    res.json({
      totalUsers,
      totalCourses,
      totalEnrollments
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
};
