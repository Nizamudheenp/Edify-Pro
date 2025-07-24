const CourseDB = require('../models/courseModel');

exports.getAllPublishedCourses = async (req, res) => {
  try {
    const courses = await CourseDB.find({ isPublished: true }).populate('instructor', 'name email');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPublishedCourseById = async (req, res) => {
  try {
    const course = await CourseDB.findOne({ _id: req.params.id, isPublished: true }).populate('instructor', 'name email');
    if (!course) return res.status(404).json({ message: 'Course not found or not published' });

    res.json(course);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

