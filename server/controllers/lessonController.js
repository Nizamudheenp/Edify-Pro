const LessonDB = require('../models/lessonModel');

exports.addLesson = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, content, videoUrl, resources } = req.body;

    const lesson = await LessonDB.create({
      course: courseId,
      title,
      content,
      videoUrl,
      resources
    });

    res.status(201).json(lesson);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getLessons = async (req, res) => {
  try {
    const { courseId } = req.params;
    const lessons = await LessonDB.find({ course: courseId });
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, videoUrl, resources } = req.body;

    const lesson = await LessonDB.findById(id);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

    lesson.title = title || lesson.title;
    lesson.content = content || lesson.content;
    lesson.videoUrl = videoUrl || lesson.videoUrl;
    lesson.resources = resources || lesson.resources;

    const updated = await lesson.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await LessonDB.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Lesson not found' });
    res.json({ message: 'Lesson deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
