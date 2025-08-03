import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../api/api';
import { toast } from 'sonner';

const StudentCourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/student/courses/${id}`);
        setCourse(res.data.course);
        setIsEnrolled(res.data.isEnrolled);
      } catch (err) {
        console.error('Error fetching course:', err);
        toast.error("Failed to load course");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const handleEnroll = async () => {
    try {
      await api.post(`/enroll/${id}`);
      toast.success("Enrolled successfully!");
      navigate('/student/dashboard/my-courses');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Enrollment failed');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <p className="text-gray-500 text-lg">Loading course...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <p className="text-red-500 text-lg">Course not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow p-6">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{course.title}</h1>
        <p className="text-gray-700 text-base mb-4">{course.description}</p>
        <p className="text-sm text-gray-500 mb-6">
          Instructor: <span className="font-medium">{course.instructor?.name}</span>
        </p>

        {isEnrolled ? (
          <button
            onClick={() => navigate(`/student/dashboard/lessons/${id}`)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium transition"
          >
            Go to Course
          </button>
        ) : (
          <button
            onClick={handleEnroll}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition"
          >
            Enroll Now
          </button>
        )}
      </div>
    </div>
  );
};

export default StudentCourseDetail;
