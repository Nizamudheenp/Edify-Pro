// src/pages/student/StudentCourses.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/api';

const StudentCourses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/student/courses');
        setCourses(res.data);
        
      } catch (err) {
        console.error('Failed to fetch courses', err);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Available Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses.map(course => (
          <div key={course._id} className="bg-white rounded shadow p-4">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-40 object-cover rounded mb-3"
            />
            <h2 className="text-xl font-semibold">{course.title}</h2>
            <p className="text-gray-600">{course.description}</p>
            <p className="text-sm text-gray-500 mt-2">
              By {course.instructor?.name} ({course.instructor?.email})
            </p>
            <Link
              to={`/student/dashboard/courses/${course._id}`}
              className="inline-block mt-3 text-blue-500 hover:underline"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentCourses;
