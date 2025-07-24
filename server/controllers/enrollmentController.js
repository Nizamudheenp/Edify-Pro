const EnrollmentDB =  require('../models/enrollmentModel.js'); 
const CourseDB =  require('../models/courseModel.js'); 
const UserDB = require('../models/userModel');

exports.enrollCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;

    const course = await CourseDB.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const existing = await EnrollmentDB.findOne({
      student: req.user._id,
      course: courseId,
    });
    if (existing) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    const enrollment = await EnrollmentDB.create({
      student: req.user._id,
      course: courseId,
    });

    res.status(201).json(enrollment);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getEnrolledCourses = async (req, res) => {
  try {
    const enrollments = await EnrollmentDB.find({ student: req.user._id })
      .populate('course');
    res.status(200).json(enrollments);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getEnrolledStudents = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await CourseDB.findOne({ _id: courseId, instructor: req.user._id });
    if (!course) {
      return res.status(403).json({ message: 'You do not have access to this course' });
    }

    const enrollments = await EnrollmentDB.find({ course: courseId }).populate('student', 'name email');
    
    res.json({ students: enrollments.map(e => e.student) });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
