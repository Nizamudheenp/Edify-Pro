import { useEffect, useState } from 'react';
import api from '../../api/api';

const ProgressTracker = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        const courseRes = await api.get('/enroll/my-courses');
        const enrolledCourses = courseRes.data.map(e => e.course);

        const courseProgress = await Promise.all(
          enrolledCourses.map(async (course) => {
            const lessonRes = await api.get(`/lessons/student/${course._id}`);
            const completedRes = await api.get(`/lessons/student/${course._id}/completed`);

            const totalLessons = lessonRes.data.length;
            const completedLessons = completedRes.data.completedLessons.length;
            const percent = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0;

            return {
              title: course.title,
              totalLessons,
              completedLessons,
              percent,
            };
          })
        );

        setCourses(courseProgress);
      } catch (err) {
        console.error('Failed to load progress', err);
      }
    };

    fetchProgressData();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">Your Course Progress</h2>

      {courses.length === 0 ? (
        <p className="text-center text-gray-500">No enrolled courses found.</p>
      ) : (
        <div className="space-y-6">
          {courses.map((course, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">{course.title}</h3>
              <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden mb-2">
                <div
                  className="bg-blue-600 h-full transition-all duration-300"
                  style={{ width: `${course.percent}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">
                {course.completedLessons} of {course.totalLessons} lessons completed ({course.percent}%)
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;
