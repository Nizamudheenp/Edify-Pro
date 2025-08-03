import { useEffect, useState } from 'react';
import api from '../../api/api';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import StudentQuiz from '../../components/student/StudentQuiz';
import StudentAssignment from '../../components/student/StudentAssignment';

const StudentLessonView = () => {
  const { id: courseId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [expandedLessonId, setExpandedLessonId] = useState(null);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await api.get(`/lessons/student/${courseId}`);
        const completed = await api.get(`/lessons/student/${courseId}/completed`);
        setLessons(res.data);
        setCompletedLessons(completed.data.completedLessons || []);
      } catch (err) {
        console.error('Error loading lessons:', err);
      }
    };

    fetchLessons();
  }, [courseId]);

  const handleMarkComplete = async (lessonId) => {
    try {
      await api.post(`/lessons/student/${courseId}/complete/${lessonId}`);
      setCompletedLessons((prev) => [...prev, lessonId]);
      toast.success('Lesson marked as complete');
    } catch (err) {
      toast.error('Failed to mark lesson complete');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
  <h2 className="text-3xl font-bold mb-6 text-blue-800">📚 Course Lessons</h2>

  {lessons.map((lesson) => {
    const isCompleted = completedLessons.includes(lesson._id);
    const isExpanded = expandedLessonId === lesson._id;

    return (
      <div key={lesson._id} className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm hover:shadow-md transition">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-800">
            {lesson.title} {isCompleted && <span className="text-green-600">✅</span>}
          </h3>
          <div className="flex gap-2">
            {!isCompleted && (
              <button
                onClick={() => handleMarkComplete(lesson._id)}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition"
              >
                Mark Complete
              </button>
            )}
            <button
              onClick={() => setExpandedLessonId(isExpanded ? null : lesson._id)}
              className="text-blue-600 hover:underline text-sm"
            >
              {isExpanded ? 'Hide' : 'View'}
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 space-y-5 text-gray-700">
            <p className="whitespace-pre-line">{lesson.content}</p>
            <StudentQuiz lessonId={lesson._id} />
            <StudentAssignment lessonId={lesson._id} />
          </div>
        )}
      </div>
    );
  })}
</div>

  );
};

export default StudentLessonView;
