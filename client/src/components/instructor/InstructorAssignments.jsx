// src/components/instructor/InstructorAssignments.jsx
import { useState } from 'react';
import { toast } from 'sonner';
import api from '../../api/api';

const InstructorAssignments = ({
    lessonId,
    assignments,
    setAssignments,
}) => {
    const [showAssignmentModal, setShowAssignmentModal] = useState(false);
    const [assignmentForm, setAssignmentForm] = useState({ title: '', description: '', dueDate: '' });
    const [editingAssignmentId, setEditingAssignmentId] = useState(null);

    const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
    const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
    const [submissions, setSubmissions] = useState([]);

    const openAssignmentModal = () => {
        setAssignmentForm({ title: '', description: '', dueDate: '' });
        setEditingAssignmentId(null);
        setShowAssignmentModal(true);
    };

    const handleAssignmentChange = (e) => {
        setAssignmentForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleAssignmentSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...assignmentForm, lesson: lessonId };

            if (editingAssignmentId) {
                await api.put(`/assignments/${editingAssignmentId}`, payload);
                toast.success('Assignment updated');
            } else {
                await api.post(`/assignments`, payload);
                toast.success('Assignment created');
            }

            const res = await api.get(`/assignments/lesson/${lessonId}`);
            setAssignments(prev => ({ ...prev, [lessonId]: res.data }));

            setShowAssignmentModal(false);
        } catch {
            toast.error('Failed to save assignment');
        }
    };

    const handleEditAssignment = (assignment) => {
        setAssignmentForm({
            title: assignment.title,
            description: assignment.description,
            dueDate: assignment.dueDate?.slice(0, 10),
        });
        setEditingAssignmentId(assignment._id);
        setShowAssignmentModal(true);
    };

    const handleDeleteAssignment = async (id) => {
        try {
            await api.delete(`/assignments/${id}`);
            toast.success('Assignment deleted');
            const res = await api.get(`/assignments/lesson/${lessonId}`);
            setAssignments(prev => ({ ...prev, [lessonId]: res.data }));
        } catch {
            toast.error('Failed to delete assignment');
        }
    };

    const fetchSubmissions = async (assignmentId) => {
        try {
            const res = await api.get(`/assignments/submissions/${assignmentId}`);
            setSubmissions(res.data);
            setSelectedAssignmentId(assignmentId);
            setShowSubmissionsModal(true);
        } catch {
            toast.error('Failed to fetch submissions');
        }
    };

    const gradeSubmission = async (studentId, grade) => {
        try {
            await api.put(`/assignments/grade/${selectedAssignmentId}/${studentId}`, { grade });
            toast.success('Graded successfully');
            fetchSubmissions(selectedAssignmentId);
        } catch {
            toast.error('Failed to grade');
        }
    };

    return (
        <div className="mt-6">
            <button
                onClick={openAssignmentModal}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow transition"
            >
                + Create Assignment
            </button>

            {assignments[lessonId]?.map((assignment) => (
                <div
                    key={assignment._id}
                    className="bg-gray-50 border border-gray-200 mt-4 p-4 rounded-xl shadow-sm"
                >
                    <h4 className="text-lg font-semibold text-gray-800">{assignment.title}</h4>
                    <p className="text-gray-600 mt-1">{assignment.description}</p>
                    <div className="mt-3 space-x-4">
                        <button
                            onClick={() => handleEditAssignment(assignment)}
                            className="text-blue-600 hover:underline"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleDeleteAssignment(assignment._id)}
                            className="text-red-600 hover:underline"
                        >
                            Delete
                        </button>
                        <button
                            onClick={() => fetchSubmissions(assignment._id)}
                            className="text-green-600 hover:underline"
                        >
                            View Submissions
                        </button>
                    </div>
                </div>
            ))}

            {/* Assignment Modal */}
            {showAssignmentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            {editingAssignmentId ? 'Edit Assignment' : 'Create Assignment'}
                        </h2>
                        <form onSubmit={handleAssignmentSubmit} className="space-y-4">
                            <input
                                type="text"
                                name="title"
                                value={assignmentForm.title}
                                onChange={handleAssignmentChange}
                                placeholder="Title"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                                required
                            />
                            <textarea
                                name="description"
                                value={assignmentForm.description}
                                onChange={handleAssignmentChange}
                                placeholder="Description"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                                rows={4}
                                required
                            />
                            <input
                                type="date"
                                name="dueDate"
                                value={assignmentForm.dueDate}
                                onChange={handleAssignmentChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                                required
                            />
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowAssignmentModal(false)}
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

            {/* Grading Modal */}
            {showSubmissionsModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-xl max-h-[80vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Student Submissions</h2>
                        {submissions.length === 0 ? (
                            <p className="text-gray-600">No submissions yet.</p>
                        ) : (
                            submissions.map((submission, i) => (
                                <div key={i} className="mb-4 pb-4 border-b border-gray-200">
                                    <p>
                                        <strong>Student:</strong> {submission.student.name} ({submission.student.email})
                                    </p>
                                    <p>
                                        <a
                                            href={submission.fileUrl}
                                            className="text-blue-600 hover:underline"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            View Submission
                                        </a>
                                    </p>
                                    <p className="mt-1">
                                        <strong>Grade:</strong>{' '}
                                        <span className="text-gray-700">{submission.grade}</span>
                                    </p>
                                    <div className="mt-2 flex items-center gap-2">
                                        <input
                                            type="text"
                                            placeholder="Enter grade"
                                            defaultValue={
                                                submission.grade !== 'Not graded' ? submission.grade : ''
                                            }
                                            onChange={(e) => (submission._newGrade = e.target.value)}
                                            className="border p-2 rounded w-32 focus:ring focus:ring-blue-200"
                                        />
                                        <button
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded"
                                            onClick={() =>
                                                gradeSubmission(submission.student._id, submission._newGrade)
                                            }
                                        >
                                            Grade
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                        <div className="mt-6 text-right">
                            <button
                                onClick={() => setShowSubmissionsModal(false)}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

};

export default InstructorAssignments;
