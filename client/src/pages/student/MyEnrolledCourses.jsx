import { useEffect, useState } from 'react';
import api from '../../api/api';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const MyEnrolledCourses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const res = await api.get('/enroll/my-courses');
        const extractedCourses = res.data.map(e => e.course);
        setCourses(extractedCourses);
      } catch (err) {
        toast.error('Failed to load enrolled courses');
      }
    };
    fetchMyCourses();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">My Enrolled Courses</h2>

      {courses.length === 0 ? (
        <p className="text-gray-500 text-center">You haven’t enrolled in any courses yet.</p>
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
              <h3 className="text-lg font-semibold text-gray-800">{course.title}</h3>
              <p className="text-sm text-gray-600 flex-grow mt-1 mb-4">
                {course.description?.slice(0, 80)}...
              </p>
              <Link
                to={`/student/dashboard/lessons/${course._id}`}
                className="inline-block mt-auto bg-blue-600 hover:bg-blue-700 text-white text-sm text-center font-medium px-4 py-2 rounded transition"
              >
                Go to Course
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyEnrolledCourses;
