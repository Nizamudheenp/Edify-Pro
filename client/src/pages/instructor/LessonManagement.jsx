import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/api';
import { toast } from 'sonner';
import InstructorQuizzes from '../../components/instructor/InstructorQuizzes';
import InstructorAssignments from '../../components/instructor/InstructorAssignments';

const LessonManagement = () => {
  const { courseId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [form, setForm] = useState({ title: '', content: '', videoUrl: '' });

  const [quizzes, setQuizzes] = useState({});

  const [assignments, setAssignments] = useState({});

  const fetchLessons = async () => {
    try {
      const res = await api.get(`/lessons/${courseId}`);
      setLessons(res.data);
    } catch {
      toast.error('Failed to fetch lessons');
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Lesson Management</h1>
        <button
          onClick={() => openModal()}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow transition"
        >
          + Add Lesson
        </button>
      </div>

      {lessons.length === 0 ? (
        <p className="text-gray-600">No lessons found.</p>
      ) : (
        lessons.map((lesson) => (
          <div
            key={lesson._id}
            className="border border-gray-200 rounded-xl p-5 mb-6 bg-white shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-gray-800">{lesson.title}</h2>
                <p className="text-gray-600">{lesson.content}</p>
                <a
                  href={lesson.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  {lesson.videoUrl}
                </a>
              </div>
              <div className="space-x-3">
                <button
                  onClick={() => openModal(lesson)}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteLesson(lesson._id)}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  Delete
                </button>
              </div>
            </div>

            <InstructorAssignments
              lessonId={lesson._id}
              assignments={assignments}
              setAssignments={setAssignments}
            />
            <InstructorQuizzes
              lessonId={lesson._id}
              quizzes={quizzes}
              setQuizzes={setQuizzes}
            />
          </div>
        ))
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {editingLesson ? 'Edit Lesson' : 'Add Lesson'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={form.title}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-blue-200"
                required
              />
              <textarea
                name="content"
                placeholder="Content"
                value={form.content}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-blue-200"
                rows={4}
                required
              />
              <input
                type="text"
                name="videoUrl"
                placeholder="Video URL"
                value={form.videoUrl}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring focus:ring-blue-200"
                required
              />
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

};

export default LessonManagement;
