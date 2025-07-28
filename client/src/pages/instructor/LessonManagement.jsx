import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/api';
import { toast } from 'sonner';

const LessonManagement = () => {
  const { courseId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '', videoUrl: '', resources: '' });

  const fetchLessons = async () => {
    try {
      const res = await api.get(`/lessons/${courseId}`);
      setLessons(res.data);
    } catch (err) {
      toast.error('Failed to fetch lessons');
    }
  };

  useEffect(() => {
    fetchLessons();
  }, [courseId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openModal = (lesson = null) => {
    if (lesson) {
      setEditingLesson(lesson);
      setFormData({
        title: lesson.title,
        content: lesson.content,
        videoUrl: lesson.videoUrl,
        resources: lesson.resources
      });
    } else {
      setEditingLesson(null);
      setFormData({ title: '', content: '', videoUrl: '', resources: '' });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingLesson(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingLesson) {
        await api.put(`/lessons/edit/${editingLesson._id}`, formData);
        toast.success('Lesson updated');
      } else {
        await api.post(`/lessons/${courseId}`, formData);
        toast.success('Lesson added');
      }
      fetchLessons();
      closeModal();
    } catch (err) {
      toast.error('Failed to save lesson');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lesson?')) return;
    try {
      await api.delete(`/lessons/delete/${id}`);
      toast.success('Lesson deleted');
      fetchLessons();
    } catch (err) {
      toast.error('Failed to delete lesson');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Lessons</h2>
        <button onClick={() => openModal()} className="bg-green-600 text-white px-4 py-2 rounded">Add Lesson</button>
      </div>

      {lessons.length === 0 ? (
        <p>No lessons yet.</p>
      ) : (
        <ul className="space-y-4">
          {lessons.map((lesson) => (
            <li key={lesson._id} className="bg-white shadow rounded p-4">
              <h3 className="text-lg font-semibold">{lesson.title}</h3>
              <p className="text-gray-600">{lesson.content}</p>
              <div className="mt-2 flex gap-3">
                <button onClick={() => openModal(lesson)} className="px-3 py-1 bg-blue-500 text-white rounded">Edit</button>
                <button onClick={() => handleDelete(lesson._id)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
            <h2 className="text-xl mb-4">{editingLesson ? 'Edit Lesson' : 'Add Lesson'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} className="w-full p-2 border rounded" required />
              <textarea name="content" placeholder="Content" value={formData.content} onChange={handleChange} className="w-full p-2 border rounded" required />
              <input type="text" name="videoUrl" placeholder="Video URL" value={formData.videoUrl} onChange={handleChange} className="w-full p-2 border rounded" />
              <input type="text" name="resources" placeholder="Resources" value={formData.resources} onChange={handleChange} className="w-full p-2 border rounded" />
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
