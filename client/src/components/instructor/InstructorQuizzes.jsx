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
        <div className="mt-4 border-t pt-4">
            <h4 className="font-semibold">Quizzes</h4>
            <button
                onClick={() => openQuizModal()}
                className="bg-blue-500 text-white px-2 py-1 text-sm rounded hover:bg-blue-600"
            >
                Add Quiz
            </button>

            {quizzes[lessonId]?.map((quiz) => (
                <li key={quiz._id} className="text-sm">
                    <strong>Quiz:</strong>
                    <ul className="list-disc ml-4">
                        {Array.isArray(quiz.questions) &&
                            quiz.questions.map((q, i) => (
                                <li key={i}>
                                    {q.question}
                                    <div className="flex gap-2 mt-1">
                                        <button
                                            onClick={() => openQuizModal(quiz)}
                                            className="text-blue-600 text-xs"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleQuizDelete(quiz._id)}
                                            className="text-red-600 text-xs"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </li>
                            ))}
                    </ul>
                </li>
            ))}

            {quizModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-md w-full max-w-xl">
                        <h2 className="text-xl mb-4">{editingQuiz ? 'Edit Quiz' : 'Add Quiz'}</h2>
                        <form onSubmit={handleQuizSubmit} className="space-y-4">
                            <input
                                type="text"
                                name="question"
                                placeholder="Question"
                                value={quizForm.question}
                                onChange={handleQuizFormChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                            {quizForm.options.map((opt, i) => (
                                <input
                                    key={i}
                                    type="text"
                                    placeholder={`Option ${i + 1}`}
                                    value={opt}
                                    onChange={(e) => handleQuizFormChange(e, i)}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            ))}
                            <select
                                name="correctAnswerIndex"
                                value={quizForm.correctAnswerIndex}
                                onChange={handleQuizFormChange}
                                className="w-full p-2 border rounded"
                                required
                            >
                                {quizForm.options.map((opt, idx) => (
                                    <option key={idx} value={idx}>
                                        {`Option ${idx + 1}: ${opt}`}
                                    </option>
                                ))}
                            </select>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={closeQuizModal}
                                    className="bg-gray-400 text-white px-4 py-2 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-2 rounded"
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
