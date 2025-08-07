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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Available Courses</h1>

      {courses.length === 0 ? (
        <p className="text-gray-500 text-center">No courses available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div
              key={course._id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition p-4 flex flex-col"
            >
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full object-contain max-h-60 rounded-lg mb-4"
              />
              <h2 className="text-xl font-semibold text-gray-800">{course.title}</h2>
              <p className="text-sm text-gray-600 mt-1 flex-grow">
                {course.description?.slice(0, 90)}...
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Instructor: {course.instructor?.name} ({course.instructor?.email})
              </p>
              <Link
                to={`/student/dashboard/courses/${course._id}`}
                className="mt-4 text-sm bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded transition"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentCourses;
