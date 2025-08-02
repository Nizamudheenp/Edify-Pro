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
              percent
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
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Your Course Progress</h2>
      {courses.map((course, idx) => (
        <div key={idx} className="mb-6 border p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
          <div className="w-full bg-gray-300 rounded h-4 overflow-hidden mb-1">
            <div
              className="bg-blue-600 h-full"
              style={{ width: `${course.percent}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600">
            {course.completedLessons} of {course.totalLessons} lessons completed ({course.percent}%)
          </p>
        </div>
      ))}
    </div>
  );
};

export default ProgressTracker;
