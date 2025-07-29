import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Enrolled Students</h1>

      {students.length === 0 ? (
        <p>No students enrolled yet.</p>
      ) : (
        <ul className="space-y-4">
          {students.map((student) => (
            <li key={student._id} className="border-b pb-2">
              <p className="font-semibold">{student.name}</p>
              <p className="text-gray-600 text-sm">{student.email}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EnrolledStudents;
