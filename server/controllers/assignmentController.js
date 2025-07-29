const AssignmentDB = require('../models/assignmentModel');
const cloudinary = require('../utils/cloudinary');
const fs = require('fs');

exports.createAssignment = async (req, res) => {
  try {
    const { lesson, title, description, dueDate } = req.body;

    const assignment = await AssignmentDB.create({
      lesson, title, description, dueDate
    });

    res.status(201).json(assignment);
  } catch (err) {
    res.status(500).json({ message: 'Assignment creation failed', error: err.message });
  }
};

// Get assignments by lesson
exports.getAssignmentsByLesson = async (req, res) => {
  const { lessonId } = req.params;
  const assignments = await AssignmentDB.find({ lesson: lessonId });
  res.json(assignments);
};

// Update assignment
exports.updateAssignment = async (req, res) => {
  const updated = await AssignmentDB.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

// Delete assignment
exports.deleteAssignment = async (req, res) => {
  await AssignmentDB.findByIdAndDelete(req.params.id);
  res.json({ message: 'Assignment deleted' });
};


exports.submitAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'assignments',
      resource_type: 'auto'
    });

    fs.unlinkSync(req.file.path); 

    const assignment = await AssignmentDB.findById(assignmentId);
    assignment.submissions.push({
      student: req.user._id,
      fileUrl: result.secure_url
    });

    await assignment.save();

    res.status(200).json({ message: 'Assignment submitted' });
  } catch (err) {
    res.status(500).json({ message: 'Assignment submission failed', error: err.message });
  }
};

exports.getSubmissions = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const assignment = await AssignmentDB.findById(assignmentId)
      .populate('submissions.student', 'name email');

    res.status(200).json(assignment.submissions);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch submissions', error: err.message });
  }
};

exports.gradeSubmission = async (req, res) => {
  try {
    const { assignmentId, studentId } = req.params;
    const { grade } = req.body;

    const assignment = await AssignmentDB.findById(assignmentId);

    const submission = assignment.submissions.find(sub => sub.student.toString() === studentId);
    if (!submission) return res.status(404).json({ message: 'Submission not found' });

    submission.grade = grade;
    await assignment.save();

    res.status(200).json({ message: 'Submission graded' });
  } catch (err) {
    res.status(500).json({ message: 'Grading failed', error: err.message });
  }
};
