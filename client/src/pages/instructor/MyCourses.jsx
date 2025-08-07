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
    thumbnail: null,
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
      setCourses(courses.filter((course) => course._id !== id));
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
      thumbnail: null,
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
      setCourses(courses.map((c) => (c._id === res.data._id ? res.data : c)));
      setEditModalOpen(false);
    } catch (err) {
      toast.error('Failed to update course');
    }
  };

  if (loading) return <div className="p-6 text-lg">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">My Courses</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course._id}
            className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition"
          >
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full object-contain max-h-60"
            />
            <div className="p-4 space-y-2">
              <h3 className="text-lg font-semibold text-gray-800">{course.title}</h3>
              <p className="text-sm text-gray-600">{course.description?.slice(0, 100)}...</p>
              <p className="text-xs text-blue-600 uppercase font-medium">{course.category}</p>
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <button
                  onClick={() => openEditModal(course)}
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                >
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={() => handleDelete(course._id)}
                  className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
                >
                  <FaTrash /> Delete
                </button>
                <Link
                  to={`/instructor/dashboard/course/${course._id}/lessons`}
                  className="text-sm text-purple-600 hover:underline"
                >
                  Manage Lessons
                </Link>
                <Link
                  to={`/instructor/dashboard/enrollments/${course._id}`}
                  className="text-sm text-green-600 hover:underline"
                >
                  View Enrollments
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Edit Course</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full border rounded px-3 py-2"
                required
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border rounded px-3 py-2"
                required
              />
              <input
                type="text"
                placeholder="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full border rounded px-3 py-2"
                required
              />
              <input
                type="file"
                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.files[0] })}
                className="w-full"
              />
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
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
