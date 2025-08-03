import { useEffect, useState } from 'react';
import api from '../../api/api';
import { toast } from 'sonner';

const StudentAssignment = ({ lessonId }) => {
  const [assignments, setAssignments] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState({});

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await api.get(`/assignments/student/${lessonId}`);
        setAssignments(res.data || []);
      } catch (err) {
        console.log('No assignments for this lesson or failed to fetch.');
      }
    };

    fetchAssignments();
  }, [lessonId]);

  const handleFileChange = (assignmentId, file) => {
    setSelectedFiles((prev) => ({
      ...prev,
      [assignmentId]: file,
    }));
  };

  const handleSubmit = async (assignmentId) => {
    const file = selectedFiles[assignmentId];
    if (!file) {
      toast.error('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      await api.post(`/assignments/submit/${assignmentId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Assignment submitted successfully!');
      // Refresh the assignments list to update submitted/grade status
      const res = await api.get(`/assignments/student/${lessonId}`);
      setAssignments(res.data || []);
      setSelectedFiles((prev) => {
        const updated = { ...prev };
        delete updated[assignmentId];
        return updated;
      });
    } catch (err) {
      toast.error('Failed to submit assignment.');
    }
  };

  if (!assignments.length) return null;

  return (
    <div className="border-t pt-6 mt-6">
      <h4 className="text-xl font-semibold mb-4 text-indigo-800">📂 Assignments</h4>
      {assignments.map((assignment) => (
        <div
          key={assignment._id}
          className="mb-6 bg-white p-5 rounded-lg border shadow-sm"
        >
          <h5 className="text-lg font-semibold text-gray-800 mb-1">{assignment.title}</h5>
          <p className="text-sm text-gray-600 mb-3">{assignment.description}</p>

          {assignment.submitted ? (
            <div className="text-green-700 text-sm mb-2">
              ✅ Submitted
              {assignment.fileUrl && (
                <>
                  {' '}|{' '}
                  <a
                    href={assignment.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View Submission
                  </a>
                </>
              )}
            </div>
          ) : (
            <>
              <input
                type="file"
                onChange={(e) =>
                  handleFileChange(assignment._id, e.target.files[0])
                }
                className="mb-3 block w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
              <button
                onClick={() => handleSubmit(assignment._id)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition"
              >
                Submit Assignment
              </button>
            </>
          )}

          {assignment.grade !== null && (
            <div className="mt-2 text-sm text-purple-700 font-medium">
              🏆 Grade: <span className="font-semibold">{assignment.grade}</span>
            </div>
          )}
        </div>
      ))}
    </div>

  );
};

export default StudentAssignment;
