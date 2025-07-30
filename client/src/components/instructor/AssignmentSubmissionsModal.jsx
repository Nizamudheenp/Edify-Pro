import { useEffect, useState } from 'react';
import api from '../../api/api';
import { toast } from 'sonner';

const AssignmentSubmissionsModal = ({ assignmentId, onClose }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [grading, setGrading] = useState({}); // {studentId: "A"}

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await api.get(`/api/assignments/submissions/${assignmentId}`);
        setSubmissions(res.data);
      } catch (err) {
        toast.error('Failed to fetch submissions');
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, [assignmentId]);

  const handleGradeSubmit = async (studentId) => {
    try {
      const grade = grading[studentId];
      if (!grade) return toast.warning('Please enter a grade');

      await api.put(`/api/assignments/grade/${assignmentId}/${studentId}`, { grade });

      // Optimistically update UI
      setSubmissions((prev) =>
        prev.map((sub) =>
          sub.student._id === studentId ? { ...sub, grade } : sub
        )
      );

      toast.success('Graded successfully');
    } catch (err) {
      toast.error('Grading failed');
    }
  };

  if (loading) return <div className="p-4">Loading submissions...</div>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[90%] max-w-3xl max-h-[90vh] overflow-y-auto shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Student Submissions</h2>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-red-500">✖</button>

        {submissions.length === 0 ? (
          <p>No submissions yet.</p>
        ) : (
          <table className="w-full table-auto border">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Student</th>
                <th className="p-2 border">File</th>
                <th className="p-2 border">Submitted</th>
                <th className="p-2 border">Grade</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub) => (
                <tr key={sub.student._id}>
                  <td className="p-2 border">{sub.student.name} <br /> <small>{sub.student.email}</small></td>
                  <td className="p-2 border">
                    <a href={sub.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View</a>
                  </td>
                  <td className="p-2 border">{new Date(sub.submittedAt).toLocaleString()}</td>
                  <td className="p-2 border text-center">
                    {sub.grade !== 'Not graded' ? (
                      <span className="text-green-600 font-medium">{sub.grade}</span>
                    ) : (
                      <input
                        type="text"
                        placeholder="Grade"
                        value={grading[sub.student._id] || ''}
                        onChange={(e) =>
                          setGrading({ ...grading, [sub.student._id]: e.target.value })
                        }
                        className="border px-2 py-1 w-20"
                      />
                    )}
                  </td>
                  <td className="p-2 border text-center">
                    {sub.grade !== 'Not graded' ? (
                      <span className="text-gray-500 italic">Graded</span>
                    ) : (
                      <button
                        onClick={() => handleGradeSubmit(sub.student._id)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      >
                        Submit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AssignmentSubmissionsModal;
