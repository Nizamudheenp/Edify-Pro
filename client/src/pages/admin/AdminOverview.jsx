import { useEffect, useState } from 'react';
import api from '../../api/api';
import { motion } from 'framer-motion';
import { Users, Book, CheckCircle } from 'lucide-react';

const AdminOverview = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
  });
  const [trendingCourses, setTrendingCourses] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch stats', err);
      }
    };

    fetchStats();
  }, []);


  useEffect(() => {
    const fetchTrendingCourses = async () => {
      try {
        const res = await api.get('/admin/trending-courses');
        setTrendingCourses(res.data);
      } catch (err) {
        console.error('Failed to fetch trending courses', err);
      }
    };

    fetchTrendingCourses();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-10 px-4 sm:px-6 lg:px-8"
    >
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-red-100 rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition">
          <Users className="text-red-600 h-8 w-8 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-gray-700">Total Users</h2>
          <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
        </div>

        <div className="bg-white border border-red-100 rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition">
          <Book className="text-red-600 h-8 w-8 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-gray-700">Total Courses</h2>
          <p className="text-3xl font-bold text-gray-900">{stats.totalCourses}</p>
        </div>

        <div className="bg-white border border-red-100 rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition">
          <CheckCircle className="text-red-600 h-8 w-8 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-gray-700">Total Enrollments</h2>
          <p className="text-3xl font-bold text-gray-900">{stats.totalEnrollments}</p>
        </div>

        

      </div>
      <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Most Trending Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingCourses.map((course) => (
              <div key={course.courseId} className="bg-white rounded-2xl border shadow p-4 hover:shadow-lg transition">
                <img src={course.thumbnail} alt={course.title} className="w-full h-40 object-cover rounded-xl mb-3" />
                <h3 className="text-lg font-semibold text-gray-700">{course.title}</h3>
                <p className="text-sm text-gray-500">Enrollments: {course.enrollCount}</p>
              </div>
            ))}
          </div>
        </div>
    </motion.div>
  );
};

export default AdminOverview;
