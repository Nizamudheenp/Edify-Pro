import { useEffect, useState } from 'react';
import api from '../../api/api';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

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
      fetchCourses();
    } catch (err) {
      toast.error('Failed to update course status');
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="py-10 px-4 sm:px-6 lg:px-8"
    >
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Manage Courses</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-xl shadow-sm">
          <thead className="bg-red-700 text-white">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Instructor</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {courses.length > 0 ? (
              courses.map((course) => (
                <tr key={course._id} className="border-t">
                  <td className="p-3 font-medium text-gray-800">{course.title}</td>
                  <td className="p-3 text-gray-700">
                    {course.instructor?.name}
                    <br />
                    <span className="text-xs text-gray-500">{course.instructor?.email}</span>
                  </td>
                  <td className="p-3 text-center">
                    {course.published ? (
                      <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        Published
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                        Unpublished
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => togglePublish(course._id, course.published)}
                      className={`px-4 py-1 rounded text-white font-semibold text-sm ${
                        course.published ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'
                      } transition`}
                    >
                      {course.published ? 'Unpublish' : 'Publish'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500">
                  No courses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default AdminCourses;
