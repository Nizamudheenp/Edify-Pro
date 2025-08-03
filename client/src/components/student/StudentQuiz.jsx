import { useEffect, useState } from 'react';
import api from '../../api/api';
import { toast } from 'sonner';

const StudentQuiz = ({ lessonId }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await api.get(`/quizzes/student/questions/all/${lessonId}`);
        setQuizzes(res.data.quizzes || []);
      } catch (err) {
        console.error('Failed to load quizzes');
      }
    };

    fetchQuizzes();
  }, [lessonId]);

  const handleChange = (quizId, questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [quizId]: {
        ...prev[quizId],
        [questionId]: value,
      },
    }));
  };

  const handleSubmit = async (quizId, questions) => {
    try {
      const selected = questions.map((q) => {
        const answer = answers[quizId]?.[q._id];
        return q.options.indexOf(answer);
      });

      const res = await api.post(`/quizzes/student/submit/${lessonId}`, {
        quizId,
        selectedAnswers: selected,
      });

      toast.success('Quiz submitted!');
      const updated = quizzes.map((q) =>
        q._id === quizId ? { ...q, attempted: true, score: res.data.score } : q
      );
      setQuizzes(updated);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Quiz submission failed.');
    }
  };

  if (!quizzes.length) return null;

  return (
    <div className="border-t pt-6">
      <h4 className="text-xl font-semibold mb-4 text-purple-800">📝 Quizzes</h4>
      {quizzes.map((quiz, index) => (
        <div key={quiz._id} className="mb-6 bg-gray-50 p-5 rounded-lg border shadow-sm">
          <h5 className="text-lg font-semibold mb-2 text-gray-800">Quiz {index + 1}</h5>
          {quiz.attempted ? (
            <p className="text-green-700 font-medium">✅ Completed — Score: {quiz.score} / {quiz.questions.length}</p>
          ) : (
            <>
              {quiz.questions.map((q) => (
                <div key={q._id} className="mb-4">
                  <p className="font-medium text-gray-700 mb-1">{q.question}</p>
                  <div className="space-y-1">
                    {q.options.map((opt, idx) => (
                      <label key={`${q._id}-${idx}`} className="flex items-center gap-2 text-gray-600">
                        <input
                          type="radio"
                          name={`${quiz._id}-${q._id}`}
                          value={opt}
                          onChange={() => handleChange(quiz._id, q._id, opt)}
                          checked={answers[quiz._id]?.[q._id] === opt}
                          className="accent-purple-600"
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <button
                onClick={() => handleSubmit(quiz._id, quiz.questions)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded mt-3 transition"
              >
                Submit Quiz
              </button>
            </>
          )}
        </div>
      ))}
    </div>

  );
};

export default StudentQuiz;
