// src/pages/admin/AdminCourses.jsx
import { useEffect, useState } from 'react';
import api from '../../api/api';
import { toast } from 'sonner';

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);

  const fetchCourses = async () => {
    try {
      const res = await api.get('/admin/courses');
      setCourses(res.data);
    } catch (err) {
      toast.error('Failed to load courses');
    }
  };

  const togglePublish = async (courseId, currentStatus) => {
    try {
      await api.put(`/admin/course/${courseId}/status`, {
        published: !currentStatus,
      });
      toast.success(`Course ${!currentStatus ? 'published' : 'unpublished'} successfully`);
      fetchCourses(); // Refresh
    } catch (err) {
      toast.error('Failed to update course status');
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Courses</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead className="bg-red-800 text-white">
            <tr>
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Instructor</th>
              <th className="p-2 border">Published</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(course => (
              <tr key={course._id}>
                <td className="p-2 border">{course.title}</td>
                <td className="p-2 border">
                  {course.instructor?.name} <br />
                  <span className="text-xs text-gray-600">{course.instructor?.email}</span>
                </td>
                <td className="p-2 border text-center">
                  {course.published ? (
                    <span className="text-green-600 font-semibold">Published</span>
                  ) : (
                    <span className="text-yellow-600 font-semibold">Unpublished</span>
                  )}
                </td>
                <td className="p-2 border text-center">
                  <button
                    onClick={() => togglePublish(course._id, course.published)}
                    className={`px-3 py-1 rounded text-white ${
                      course.published ? 'bg-yellow-600' : 'bg-green-600'
                    }`}
                  >
                    {course.published ? 'Unpublish' : 'Publish'}
                  </button>
                </td>
              </tr>
            ))}
            {courses.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No courses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCourses;
