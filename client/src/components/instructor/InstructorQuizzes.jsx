import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import api from '../../api/api';

const InstructorQuizzes = ({
    lessonId,
    quizzes,
    setQuizzes,
}) => {
    const [quizModalOpen, setQuizModalOpen] = useState(false);
    const [editingQuiz, setEditingQuiz] = useState(null);
    const [quizForm, setQuizForm] = useState({
        question: '',
        options: ['', '', '', ''],
        correctAnswerIndex: 0,
    });

    const fetchQuizzes = async () => {
        try {
            const res = await api.get(`/quizzes/lesson/${lessonId}`);
            const data = Array.isArray(res.data) ? res.data : [];
            setQuizzes((prev) => ({ ...prev, [lessonId]: data }));
        } catch (err) {
            if (err.response?.status === 404) {
                setQuizzes((prev) => ({ ...prev, [lessonId]: [] }));
            } else {
                toast.error('Failed to fetch quizzes');
            }
        }
    };

    useEffect(() => {
        fetchQuizzes();
    }, [lessonId]);

    const openQuizModal = (quiz = null) => {
        if (quiz) {
            const firstQ = quiz.questions?.[0];
            setEditingQuiz(quiz);
            setQuizForm({
                question: firstQ?.question || '',
                options: firstQ?.options || ['', '', '', ''],
                correctAnswerIndex: firstQ?.correctAnswerIndex ?? 0,
            });
        } else {
            setEditingQuiz(null);
            setQuizForm({
                question: '',
                options: ['', '', '', ''],
                correctAnswerIndex: 0,
            });
        }
        setQuizModalOpen(true);
    };

    const closeQuizModal = () => {
        setQuizModalOpen(false);
        setEditingQuiz(null);
    };

    const handleQuizFormChange = (e, index = null) => {
        if (index !== null) {
            const updatedOptions = [...quizForm.options];
            updatedOptions[index] = e.target.value;
            setQuizForm({ ...quizForm, options: updatedOptions });
        } else {
            const { name, value } = e.target;
            setQuizForm({
                ...quizForm,
                [name]: name === 'correctAnswerIndex' ? parseInt(value) : value,
            });
        }
    };

    const handleQuizSubmit = async (e) => {
        e.preventDefault();

        const formattedPayload = {
            lesson: lessonId,
            questions: [
                {
                    question: quizForm.question,
                    options: quizForm.options,
                    correctAnswerIndex: quizForm.correctAnswerIndex,
                },
            ],
        };

        try {
            if (editingQuiz) {
                await api.put(`/quizzes/${editingQuiz._id}`, formattedPayload);
                toast.success('Quiz updated');
            } else {
                await api.post(`/quizzes`, formattedPayload);
                toast.success('Quiz added');
            }
            await fetchQuizzes();
            closeQuizModal();
        } catch {
            toast.error('Failed to save quiz');
        }
    };

    const handleQuizDelete = async (quizId) => {
        if (!window.confirm('Delete this quiz?')) return;
        try {
            await api.delete(`/quizzes/${quizId}`);
            toast.success('Quiz deleted');
            await fetchQuizzes();
        } catch {
            toast.error('Failed to delete quiz');
        }
    };

    return (
        <div className="mt-6 border-t border-gray-200 pt-6">
            <div className="flex justify-between items-center mb-2">
                <h4 className="text-lg font-semibold text-gray-800">Quizzes</h4>
                <button
                    onClick={() => openQuizModal()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
                >
                    + Add Quiz
                </button>
            </div>

            {quizzes[lessonId]?.map((quiz) => (
                <div key={quiz._id} className="bg-gray-50 border border-gray-200 p-4 rounded-xl mt-4 shadow-sm">
                    {quiz.questions?.map((q, i) => (
                        <div key={i} className="mb-3">
                            <p className="text-gray-800 font-medium mb-1">{q.question}</p>
                            <ul className="list-disc ml-6 text-sm text-gray-600">
                                {q.options.map((option, idx) => (
                                    <li key={idx} className={`${q.correctAnswerIndex === idx ? 'font-semibold text-green-600' : ''}`}>
                                        {option}
                                    </li>
                                ))}
                            </ul>
                            <div className="flex gap-4 mt-2 text-sm">
                                <button
                                    onClick={() => openQuizModal(quiz)}
                                    className="text-blue-600 hover:underline"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleQuizDelete(quiz._id)}
                                    className="text-red-600 hover:underline"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ))}

            {quizModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-xl">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">{editingQuiz ? 'Edit Quiz' : 'Add Quiz'}</h2>
                        <form onSubmit={handleQuizSubmit} className="space-y-4">
                            <input
                                type="text"
                                name="question"
                                placeholder="Enter quiz question"
                                value={quizForm.question}
                                onChange={handleQuizFormChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                                required
                            />
                            {quizForm.options.map((opt, i) => (
                                <input
                                    key={i}
                                    type="text"
                                    placeholder={`Option ${i + 1}`}
                                    value={opt}
                                    onChange={(e) => handleQuizFormChange(e, i)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    required
                                />
                            ))}
                            <select
                                name="correctAnswerIndex"
                                value={quizForm.correctAnswerIndex}
                                onChange={handleQuizFormChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                                required
                            >
                                {quizForm.options.map((opt, idx) => (
                                    <option key={idx} value={idx}>
                                        {`Correct Answer: Option ${idx + 1} - ${opt}`}
                                    </option>
                                ))}
                            </select>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closeQuizModal}
                                    className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );

};

export default InstructorQuizzes;
