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
    <div className="mt-4">
      <button onClick={openAssignmentModal} className="bg-purple-600 text-white px-3 py-1 rounded">Create Assignment</button>

      {assignments[lessonId]?.map((assignment) => (
        <div key={assignment._id} className="bg-gray-100 p-3 mt-2 rounded">
          <h4 className="font-semibold">{assignment.title}</h4>
          <p className="text-sm text-gray-600">{assignment.description}</p>
          <div className="mt-2 space-x-2">
            <button onClick={() => handleEditAssignment(assignment)} className="text-blue-600 hover:underline">Edit</button>
            <button onClick={() => handleDeleteAssignment(assignment._id)} className="text-red-600 hover:underline">Delete</button>
            <button onClick={() => fetchSubmissions(assignment._id)} className="text-green-600 hover:underline">View Submissions</button>
          </div>
        </div>
      ))}

      {/* Assignment Modal */}
      {showAssignmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
            <h2 className="text-xl mb-4">
              {editingAssignmentId ? 'Edit Assignment' : 'Create Assignment'}
            </h2>
            <form onSubmit={handleAssignmentSubmit} className="space-y-4">
              <input type="text" name="title" value={assignmentForm.title} onChange={handleAssignmentChange} placeholder="Title" className="w-full p-2 border rounded" required />
              <textarea name="description" value={assignmentForm.description} onChange={handleAssignmentChange} placeholder="Description" className="w-full p-2 border rounded" required />
              <input type="date" name="dueDate" value={assignmentForm.dueDate} onChange={handleAssignmentChange} className="w-full p-2 border rounded" required />
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowAssignmentModal(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grading Modal */}
      {showSubmissionsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-xl">
            <h2 className="text-xl mb-4">Student Submissions</h2>
            {submissions.length === 0 ? (
              <p>No submissions yet.</p>
            ) : (
              submissions.map((submission, i) => (
                <div key={i} className="mb-4 border-b pb-2">
                  <p><strong>Student:</strong> {submission.student.name} ({submission.student.email})</p>
                  <p><a href={submission.fileUrl} className="text-blue-600" target="_blank" rel="noopener noreferrer">View Submission</a></p>
                  <p><strong>Grade:</strong> {submission.grade}</p>
                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="Enter grade"
                      className="border p-1 rounded mr-2"
                      defaultValue={submission.grade !== 'Not graded' ? submission.grade : ''}
                      onChange={(e) => submission._newGrade = e.target.value}
                    />
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                      onClick={() => gradeSubmission(submission.student._id, submission._newGrade)}
                    >
                      Grade
                    </button>
                  </div>
                </div>
              ))
            )}
            <div className="mt-4 text-right">
              <button onClick={() => setShowSubmissionsModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorAssignments;
