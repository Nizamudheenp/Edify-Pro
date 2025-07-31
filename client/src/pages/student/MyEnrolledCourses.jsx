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
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">My Enrolled Courses</h2>

      {courses.length === 0 ? (
        <p>No enrolled courses yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map(course => (
            <div key={course._id} className="border p-4 rounded shadow hover:shadow-lg transition">
              <img src={course.thumbnail} alt="Thumbnail" className="h-40 w-full object-cover rounded mb-2" />
              <h3 className="text-lg font-semibold">{course.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{course.description?.slice(0, 80)}...</p>
              <Link to={`/student/dashboard/courses/${course._id}`} className="text-blue-600 underline">
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
