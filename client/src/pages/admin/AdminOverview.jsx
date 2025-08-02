// src/pages/admin/AdminOverview.jsx
import { useEffect, useState } from 'react';
import api from '../../api/api';

const AdminOverview = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
  });

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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-red-100 p-4 rounded shadow text-center">
        <h2 className="text-xl font-bold">Total Users</h2>
        <p className="text-2xl">{stats.totalUsers}</p>
      </div>
      <div className="bg-red-100 p-4 rounded shadow text-center">
        <h2 className="text-xl font-bold">Total Courses</h2>
        <p className="text-2xl">{stats.totalCourses}</p>
      </div>
      <div className="bg-red-100 p-4 rounded shadow text-center">
        <h2 className="text-xl font-bold">Total Enrollments</h2>
        <p className="text-2xl">{stats.totalEnrollments}</p>
      </div>
    </div>
  );
};

export default AdminOverview;
