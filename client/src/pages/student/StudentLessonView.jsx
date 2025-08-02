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
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Course Lessons</h2>
      {lessons.map((lesson) => {
        const isCompleted = completedLessons.includes(lesson._id);
        const isExpanded = expandedLessonId === lesson._id;

        return (
          <div key={lesson._id} className="border p-4 mb-4 rounded shadow">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                {lesson.title} {isCompleted && <span className="text-green-600">✅</span>}
              </h3>
              <div className="flex gap-2">
                {!isCompleted && (
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                    onClick={() => handleMarkComplete(lesson._id)}
                  >
                    Mark Complete
                  </button>
                )}
                <button
                  onClick={() =>
                    setExpandedLessonId(isExpanded ? null : lesson._id)
                  }
                  className="text-blue-600 underline"
                >
                  {isExpanded ? 'Hide' : 'View'}
                </button>
              </div>
            </div>

            {isExpanded && (
              <div className="mt-4 space-y-4">
                <p>{lesson.content}</p>
                <StudentQuiz lessonId={lesson._id} />
                {lesson._id && (
                  <StudentAssignment lessonId={lesson._id} />
                )}

              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StudentLessonView;
