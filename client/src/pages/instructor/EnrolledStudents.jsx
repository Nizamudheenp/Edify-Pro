import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/api';
import { toast } from 'sonner';

const EnrolledStudents = () => {
  const { courseId } = useParams();
  const [students, setStudents] = useState([]);

  const fetchStudents = async () => {
    try {
      const res = await api.get(`/enroll/instructor/${courseId}`);
      setStudents(res.data.students);
    } catch (err) {
      toast.error('Failed to load enrolled students');
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [courseId]);

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Enrolled Students</h1>

      {students.length === 0 ? (
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-md">
          No students have enrolled in this course yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {students.map((student) => (
            <div
              key={student._id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold text-gray-800">{student.name}</h2>
              <p className="text-sm text-gray-600">{student.email}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnrolledStudents;
