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
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Lesson Management</h1>
        <button onClick={() => openModal()} className="bg-green-600 text-white px-4 py-2 rounded">Add Lesson</button>
      </div>

      {lessons.length === 0 ? (
        <p>No lessons found.</p>
      ) : (lessons.map((lesson) => (
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
      
    </div>
  );
};

export default LessonManagement;
