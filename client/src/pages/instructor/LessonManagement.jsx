import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/api';
import { toast } from 'sonner';
import InstructorQuizzes from '../../components/instructor/InstructorQuizzes';

const LessonManagement = () => {
  const { courseId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [form, setForm] = useState({ title: '', content: '', videoUrl: '' });

  const [quizzes, setQuizzes] = useState({});

  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [assignmentLessonId, setAssignmentLessonId] = useState(null);
  const [assignmentForm, setAssignmentForm] = useState({ title: '', description: '', dueDate: '' });
  const [assignments, setAssignments] = useState({});
  const [editingAssignmentId, setEditingAssignmentId] = useState(null);

  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);

  const fetchLessons = async () => {
    try {
      const res = await api.get(`/lessons/${courseId}`);
      setLessons(res.data);
    } catch {
      toast.error('Failed to fetch lessons');
    }
  };

  const fetchSubmissions = async (assignmentId) => {
    try {
      const res = await api.get(`/assignments/submissions/${assignmentId}`);
      setSubmissions(res.data);
      setSelectedAssignmentId(assignmentId);
      setShowSubmissionsModal(true);
    } catch {
      toast.error('Failed to fetch submissions');
    }
  };

  const gradeSubmission = async (studentId, grade) => {
    try {
      await api.put(`/assignments/grade/${selectedAssignmentId}/${studentId}`, { grade });
      toast.success('Graded successfully');
      fetchSubmissions(selectedAssignmentId);
    } catch {
      toast.error('Failed to grade');
    }
  };




  const fetchAssignments = async (lessonId) => {
    try {
      const res = await api.get(`/assignments/lesson/${lessonId}`);
      setAssignments(prev => ({ ...prev, [lessonId]: res.data }));
    } catch (err) {
      toast.error('Failed to fetch assignments');
    }
  };

  useEffect(() => {
    fetchLessons();
  }, [courseId]);


  useEffect(() => {
    lessons.forEach((lesson) => fetchAssignments(lesson._id));
  }, [lessons]);

  const openModal = (lesson = null) => {
    if (lesson) {
      setEditingLesson(lesson);
      setForm({ title: lesson.title, content: lesson.content, videoUrl: lesson.videoUrl });
    } else {
      setEditingLesson(null);
      setForm({ title: '', content: '', videoUrl: '' });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingLesson(null);
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingLesson) {
        await api.put(`/lessons/edit/${editingLesson._id}`, form);
        toast.success('Lesson updated');
      } else {
        await api.post(`/lessons/${courseId}`, form);
        toast.success('Lesson added');
      }
      fetchLessons();
      closeModal();
    } catch {
      toast.error('Error saving lesson');
    }
  };

  const deleteLesson = async (lessonId) => {
    if (!window.confirm('Delete this lesson?')) return;
    try {
      await api.delete(`/lessons/delete/${lessonId}`);
      toast.success('Lesson deleted');
      fetchLessons();
    } catch {
      toast.error('Failed to delete lesson');
    }
  };

  const openAssignmentModal = (lessonId) => {
    setAssignmentLessonId(lessonId);
    setAssignmentForm({ title: '', description: '', dueDate: '' });
    setShowAssignmentModal(true);
  };

  const handleAssignmentChange = (e) => {
    setAssignmentForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAssignmentId) {
        await api.put(`/assignments/${editingAssignmentId}`, {
          ...assignmentForm,
          lesson: assignmentLessonId,
        });
        toast.success('Assignment updated');
      } else {
        await api.post(`/assignments`, {
          ...assignmentForm,
          lesson: assignmentLessonId,
        });
        toast.success('Assignment created');
      }

      fetchAssignments(assignmentLessonId);
      setShowAssignmentModal(false);
      setEditingAssignmentId(null);
    } catch {
      toast.error('Failed to save assignment');
    }
  };

  const handleEditAssignment = (assignment) => {
    setAssignmentForm({
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate?.slice(0, 10),
    });
    setAssignmentLessonId(assignment.lesson);
    setEditingAssignmentId(assignment._id);
    setShowAssignmentModal(true);
  };

  const handleDeleteAssignment = async (id, lessonId) => {
    try {
      await api.delete(`/assignments/${id}`);
      toast.success('Assignment deleted');
      fetchAssignments(lessonId);
    } catch {
      toast.error('Failed to delete assignment');
    }
  };

  const closeAssignmentModal = () => {
    setShowAssignmentModal(false);
    setAssignmentForm({ title: '', description: '', dueDate: '' });
    setEditingAssignmentId(null);
  };



  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Lesson Management</h1>
        <button onClick={() => openModal()} className="bg-green-600 text-white px-4 py-2 rounded">Add Lesson</button>
      </div>

      {lessons.length === 0 ? (
        <p>No lessons found.</p>
        ): (lessons.map((lesson) => (
        <div key={lesson._id} className="border rounded p-4 mb-4 bg-white shadow">
          <div className="flex justify-between">
            <div>
              <h2 className="text-lg font-semibold">{lesson.title}</h2>
              <p>{lesson.content}</p>
              <p className="text-sm text-blue-600">{lesson.videoUrl}</p>
            </div>
            <div className="space-x-2">
              <button onClick={() => openModal(lesson)} className="text-blue-600">Edit</button>
              <button onClick={() => deleteLesson(lesson._id)} className="text-red-600">Delete</button>
            </div>
          </div>

          <div className="mt-4">
            <button onClick={() => openAssignmentModal(lesson._id)} className="bg-purple-600 text-white px-3 py-1 rounded">Create Assignment</button>
            {assignments[lesson._id]?.map((assignment) => (
              <div key={assignment._id} className="bg-gray-100 p-3 mt-2 rounded">
                <h4 className="font-semibold">{assignment.title}</h4>
                <p className="text-sm text-gray-600">{assignment.description}</p>
                <div className="mt-2 space-x-2">
                  <button
                    onClick={() => handleEditAssignment(assignment)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteAssignment(assignment._id, lesson._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                  <button onClick={() => fetchSubmissions(assignment._id)} className="text-green-600 hover:underline">
                    View Submissions
                  </button>
                </div>
              </div>
            ))}

          </div>
          <InstructorQuizzes
            lessonId={lesson._id}
            quizzes={quizzes}
            setQuizzes={setQuizzes}
          />

        </div>
      )))}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
            <h2 className="text-xl mb-4">{editingLesson ? 'Edit Lesson' : 'Add Lesson'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" name="title" placeholder="Title" value={form.title} onChange={handleChange} className="w-full p-2 border rounded" required />
              <textarea name="content" placeholder="Content" value={form.content} onChange={handleChange} className="w-full p-2 border rounded" required />
              <input type="text" name="videoUrl" placeholder="Video URL" value={form.videoUrl} onChange={handleChange} className="w-full p-2 border rounded" required />
              <div className="flex justify-end gap-3">
                <button type="button" onClick={closeModal} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAssignmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
            <h2 className="text-xl mb-4">
              {editingAssignmentId ? 'Edit Assignment' : 'Create Assignment'}
            </h2>
            <form onSubmit={handleAssignmentSubmit} className="space-y-4">
              <input type="text" name="title" placeholder="Title" value={assignmentForm.title} onChange={handleAssignmentChange} className="w-full p-2 border rounded" required />
              <textarea name="description" placeholder="Description" value={assignmentForm.description} onChange={handleAssignmentChange} className="w-full p-2 border rounded" required />
              <input type="date" name="dueDate" value={assignmentForm.dueDate} onChange={handleAssignmentChange} className="w-full p-2 border rounded" required />
              <div className="flex justify-end gap-3">
                <button type="button" onClick={closeAssignmentModal} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSubmissionsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-xl">
            <h2 className="text-xl mb-4">Student Submissions</h2>
            {submissions.length === 0 ? (
              <p>No submissions yet.</p>
            ) : (
              submissions.map((submission, i) => (
                <div key={i} className="mb-4 border-b pb-2">
                  <p><strong>Student:</strong> {submission.student.name} ({submission.student.email})</p>
                  <p><a href={submission.fileUrl} className="text-blue-600" target="_blank" rel="noopener noreferrer">View Submission</a></p>
                  <p><strong>Grade:</strong> {submission.grade}</p>
                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="Enter grade"
                      className="border p-1 rounded mr-2"
                      defaultValue={submission.grade !== 'Not graded' ? submission.grade : ''}
                      onChange={(e) => submission._newGrade = e.target.value}
                    />
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                      onClick={() => gradeSubmission(submission.student._id, submission._newGrade)}
                    >
                      Grade
                    </button>
                  </div>
                </div>
              ))
            )}
            <div className="mt-4 text-right">
              <button onClick={() => setShowSubmissionsModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default LessonManagement;
