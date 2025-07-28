import { useEffect, useState } from 'react';
import api from '../../api/api';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    thumbnail: null
  });

  const fetchCourses = async () => {
    try {
      const res = await api.get('/instructor/courses');
      setCourses(res.data);
    } catch (err) {
      toast.error('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await api.delete(`/instructor/courses/${id}`);
      toast.success('Course deleted');
      setCourses(courses.filter(course => course._id !== id));
    } catch (err) {
      toast.error('Failed to delete course');
    }
  };

  const openEditModal = (course) => {
    setSelectedCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      category: course.category,
      thumbnail: null
    });
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('title', formData.title);
    form.append('description', formData.description);
    form.append('category', formData.category);
    if (formData.thumbnail) form.append('thumbnail', formData.thumbnail);

    try {
      const res = await api.put(`/instructor/courses/${selectedCourse._id}`, form);
      toast.success('Course updated');
      setCourses(courses.map(c => c._id === res.data._id ? res.data : c));
      setEditModalOpen(false);
    } catch (err) {
      toast.error('Failed to update course');
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">My Courses</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map(course => (
          <div key={course._id} className="bg-white rounded shadow p-4">
            <img src={course.thumbnail} alt={course.title} className="h-40 w-full object-cover rounded mb-2" />
            <h3 className="text-lg font-semibold">{course.title}</h3>
            <p className="text-sm text-gray-600">{course.description}</p>
            <p className="text-sm text-blue-500">{course.category}</p>
            <div className="flex space-x-2 mt-2">
              <button onClick={() => openEditModal(course)} className="text-blue-600 hover:text-blue-800">
                <FaEdit />
              </button>
              <button onClick={() => handleDelete(course._id)} className="text-red-600 hover:text-red-800">
                <FaTrash />
              </button>
              <Link
                to={`/instructor/dashboard/course/${course._id}/lessons`}
                className="text-blue-600 hover:underline"
              >
                Manage Lessons
              </Link>

            </div>
          </div>
        ))}
      </div>

      {/* Modal for Editing */}
      {editModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Edit Course</h3>
            <form onSubmit={handleEditSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full border p-2 rounded"
                required
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="text"
                placeholder="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="file"
                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.files[0] })}
                className="w-full"
              />
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setEditModalOpen(false)} className="px-4 py-2 bg-gray-400 text-white rounded">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCourses;
