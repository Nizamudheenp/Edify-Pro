const CourseDB = require('../models/courseModel');

exports.createCourse = async (req, res) => {
  try {
    const { title, description, category, thumbnail } = req.body;

    const course = await CourseDB.create({
      title,
      description,
      category,
      thumbnail,
      instructor: req.user._id
    });

    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getInstructorCourses = async (req, res) => {
  try {
    const courses = await CourseDB.find({ instructor: req.user._id });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const course = await CourseDB.findOne({ _id: req.params.id, instructor: req.user._id });
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const { title, description, category, thumbnail } = req.body;
    course.title = title || course.title;
    course.description = description || course.description;
    course.category = category || course.category;
    course.thumbnail = thumbnail || course.thumbnail;

    const updated = await course.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await CourseDB.findOneAndDelete({ _id: req.params.id, instructor: req.user._id });
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};
