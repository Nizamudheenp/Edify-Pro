const CourseDB = require('../models/courseModel');
const EnrollmentDB = require('../models/enrollmentModel');

exports.getAllPublishedCourses = async (req, res) => {
  try {
    const courses = await CourseDB.find({ published: true }).populate('instructor', 'name email');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPublishedCourseById = async (req, res) => {
  try {
    const course = await CourseDB.findOne({ _id: req.params.id, published: true }).populate('instructor', 'name email');
    if (!course) return res.status(404).json({ message: 'Course not found or not published' });

    let isEnrolled = false;
    if (req.user && req.user.role === 'student') {
      const enrollment = await EnrollmentDB.findOne({
        course: course._id,
        student: req.user._id,
      });
      isEnrolled = !!enrollment;
    }

    res.status(200).json({ course, isEnrolled });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

