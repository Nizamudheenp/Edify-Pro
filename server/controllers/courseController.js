const CourseDB = require('../models/courseModel');
const cloudinary = require('../utils/cloudinary');

exports.createCourse = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    let thumbnailUrl = '';

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'e-learning/thumbnails'
      });
      thumbnailUrl = result.secure_url;
    }

    const course = await CourseDB.create({
      title,
      description,
      category,
      thumbnail : thumbnailUrl,
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

    const { title, description, category } = req.body;

     if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'e-learning/thumbnails'
      });
      course.thumbnail = result.secure_url;
    }

    course.title = title || course.title;
    course.description = description || course.description;
    course.category = category || course.category;

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
