import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../features/auth/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { toast } from 'sonner';
import { redirectBasedOnRole } from '../../utils/redirectBasedOnRole';

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: '',
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (user) redirectBasedOnRole(user.role, navigate);
    }, [user]);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const validate = () => {
        const errs = {};
        if (!formData.name.trim()) errs.name = 'Name is required';
        if (!formData.email.trim()) errs.email = 'Email is required';
        if (!formData.password || formData.password.length < 5)
            errs.password = 'Password must be at least 5 characters';
        if (!formData.role) errs.role = 'Please select a role';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            const res = await api.post('/auth/register', formData);
            dispatch(setUser(res.data));
            toast.success('Registered successfully');
            redirectBasedOnRole(res.data.user.role, navigate);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
            <div className="w-full max-w-3xl mx-auto mx-4 sm:mx-6 md:mx-0 grid grid-cols-1 md:grid-cols-2 bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="hidden md:flex items-center justify-center bg-blue-100 p-6">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-3/4 h-auto"
                        viewBox="0 0 1024 1024"
                        fill="none"
                    >
                        <circle cx="512" cy="512" r="512" fill="#e0f2fe" />
                        <path
                            fill="#3b82f6"
                            d="M684 700c0-60-48-108-108-108h-84c-60 0-108 48-108 108v24h300v-24z"
                        />
                        <circle cx="512" cy="448" r="96" fill="#3b82f6" />
                        <path
                            d="M384 700a128 128 0 01256 0v24H384v-24z"
                            fill="#2563eb"
                            opacity="0.2"
                        />
                    </svg>
                </div>
                <div className="p-8">
                    <h2 className="text-3xl font-bold mb-6 text-gray-800">Create an Account</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                        </div>
                        <div>
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
                        </div>

                        <div>
                            <p className="mb-2 font-medium text-gray-700">I’m signing up as a:</p>
                            <div className="flex flex-col gap-2">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="student"
                                        checked={formData.role === 'student'}
                                        onChange={handleChange}
                                        className="accent-blue-600"
                                    />
                                    <span>Student</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="instructor"
                                        checked={formData.role === 'instructor'}
                                        onChange={handleChange}
                                        className="accent-blue-600"
                                    />
                                    <span>Instructor</span>
                                </label>
                            </div>
                            {errors.role && <p className="text-sm text-red-500 mt-1">{errors.role}</p>}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition"
                        >
                            Register
                        </button>

                        <p className="text-center text-sm mt-4">
                            Already have an account?{' '}
                            <Link to="/login" className="text-blue-600 hover:underline">
                                Login
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
