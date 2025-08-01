import { useEffect, useState } from 'react';
import api from '../../api/api';
import { toast } from 'sonner';

const StudentQuiz = ({ lessonId }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [answers, setAnswers] = useState({}); // { quizId: { questionId: selectedOption } }

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
      // Refresh to show updated state
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
    <div className="border-t pt-4">
      <h4 className="text-lg font-bold mb-2">Quizzes</h4>
      {quizzes.map((quiz, index) => (
        <div key={quiz._id} className="mb-6 p-4 border rounded">
          <h5 className="font-semibold">Quiz {index + 1}</h5>
          {quiz.attempted ? (
            <p className="text-green-700">Completed. Score: {quiz.score} / {quiz.questions.length}</p>
          ) : (
            <>
              {quiz.questions.map((q) => (
                <div key={q._id} className="mb-3">
                  <p className="font-medium">{q.question}</p>
                  {q.options.map((opt, idx) => (
                    <label key={`${q._id}-${idx}`} className="block">
                      <input
                        type="radio"
                        name={`${quiz._id}-${q._id}`}
                        value={opt}
                        onChange={() => handleChange(quiz._id, q._id, opt)}
                        checked={answers[quiz._id]?.[q._id] === opt}
                      />{' '}
                      {opt}
                    </label>
                  ))}
                </div>
              ))}
              <button
                onClick={() => handleSubmit(quiz._id, quiz.questions)}
                className="bg-purple-600 text-white px-3 py-1 rounded"
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
