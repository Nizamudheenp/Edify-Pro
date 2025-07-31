import { useEffect, useState } from 'react';
import api from '../../api/api';
import { toast } from 'sonner';

const StudentQuiz = ({ lessonId }) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await api.get(`/quizzes/student/questions/${lessonId}`);
        setQuestions(res.data);
      } catch (err) {
        console.warn('No quiz for this lesson or failed to fetch.');
      }
    };

    const fetchResult = async () => {
      try {
        const res = await api.get(`/quizzes/student/result/${lessonId}`);
        setResult(res.data);
      } catch (err) {}
    };

    fetchQuiz();
    fetchResult();
  }, [lessonId]);

  const handleChange = (qId, value) => {
    setAnswers({ ...answers, [qId]: value });
  };

  const handleSubmit = async () => {
    try {
      const res = await api.post(`/quizzes/student/submit/${lessonId}`, {
        answers,
      });
      setResult(res.data);
      toast.success('Quiz submitted!');
    } catch (err) {
      toast.error('Quiz submission failed.');
    }
  };

  if (result) {
    return (
      <div className="p-4 border rounded bg-green-50">
        <p className="font-semibold">Quiz Completed ✅</p>
        <p>Score: {result.score} / {result.total}</p>
      </div>
    );
  }

  if (!questions.length) return null;

  return (
    <div className="border-t pt-4">
      <h4 className="text-lg font-bold mb-2">Quiz</h4>
      {questions.map((q) => (
        <div key={q._id} className="mb-3">
          <p className="font-medium">{q.question}</p>
          {q.options.map((opt) => (
            <label key={opt} className="block">
              <input
                type="radio"
                name={q._id}
                value={opt}
                onChange={() => handleChange(q._id, opt)}
                checked={answers[q._id] === opt}
              />{' '}
              {opt}
            </label>
          ))}
        </div>
      ))}
      <button
        onClick={handleSubmit}
        className="bg-purple-600 text-white px-3 py-1 rounded"
      >
        Submit Quiz
      </button>
    </div>
  );
};

export default StudentQuiz;
