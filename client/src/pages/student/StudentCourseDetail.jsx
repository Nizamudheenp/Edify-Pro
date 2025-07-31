import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../api/api';
import { toast } from 'sonner';

const StudentCourseDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await api.get(`/student/courses/${id}`);
                setCourse(res.data);
            } catch (err) {
                console.error('Error fetching course:', err);
            }
        };
        fetchCourse();
    }, [id]);

    const handleEnroll = async () => {
        try {
            await api.post(`/enroll/${id}`);
            toast.success("Enrolled successfully!");
            navigate('/student/dashboard/my-courses');
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Enrollment failed');
        }
    };

    if (!course) return <div>Loading...</div>;

    return (
        <div className="max-w-3xl mx-auto p-4">
            <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-60 object-cover rounded mb-4"
            />
            <h1 className="text-3xl font-bold">{course.title}</h1>
            <p className="text-gray-700 mt-2">{course.description}</p>
            <p className="text-sm text-gray-500 mt-1">
                Instructor: {course.instructor?.name}
            </p>

            <button
                onClick={handleEnroll}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
                Enroll Now
            </button>        </div>
    );
};

export default StudentCourseDetail;
