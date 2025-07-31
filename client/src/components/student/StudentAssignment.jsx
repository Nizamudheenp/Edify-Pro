import { useState } from 'react';
import api from '../../api/api';
import { toast } from 'sonner';

const StudentAssignment = ({ assignment }) => {
  const [file, setFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!file) return toast.error('Please select a file');

    const formData = new FormData();
    formData.append('file', file);

    try {
      await api.post(`/assignments/submit/${assignment._id}`, formData);
      toast.success('Assignment submitted');
      setSubmitted(true);
    } catch (err) {
      toast.error('Submission failed');
    }
  };

  if (submitted) {
    return <p className="text-green-700">Assignment Submitted ✅</p>;
  }

  return (
    <div className="border-t pt-4">
      <h4 className="text-lg font-bold">Assignment</h4>
      <p>{assignment.title}</p>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="mt-2"
      />
      <button
        onClick={handleSubmit}
        className="bg-indigo-600 text-white px-3 py-1 mt-2 rounded"
      >
        Submit Assignment
      </button>
    </div>
  );
};

export default StudentAssignment;
