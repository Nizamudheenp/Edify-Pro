import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { toast } from 'sonner';

const CreateCourse = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !category || !thumbnail) {
      return toast.error('All fields are required');
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('thumbnail', thumbnail);

    try {
      setLoading(true);
      await api.post('/instructor/courses', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Course created successfully');
      navigate('/instructor/dashboard/courses');
    } catch (err) {
      console.error(err);
      toast.error('Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-10 py-8 bg-white shadow-lg rounded-xl">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Create a New Course</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-medium text-gray-700 mb-1">Course Title</label>
          <input
            type="text"
            placeholder="e.g. React for Beginners"
            className="w-full border rounded-lg px-4 py-2 focus:ring focus:ring-blue-200"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Description</label>
          <textarea
            placeholder="Describe your course content..."
            className="w-full border rounded-lg px-4 py-2 focus:ring focus:ring-blue-200"
            rows="5"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Category</label>
          <input
            type="text"
            placeholder="e.g. Web Development"
            className="w-full border rounded-lg px-4 py-2 focus:ring focus:ring-blue-200"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Thumbnail Image</label>
          <input
            type="file"
            accept="image/*"
            className="w-full"
            onChange={(e) => setThumbnail(e.target.files[0])}
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Course'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCourse;
