import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../features/auth/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { toast } from 'sonner';
import { redirectBasedOnRole } from '../../utils/redirectBasedOnRole';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const { user } = useSelector((state) => state.auth);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (user) {
            if (user.role === 'admin') navigate('/admin/dashboard');
            else if (user.role === 'instructor') navigate('/instructor/dashboard');
            else navigate('/student/dashboard');
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const validate = () => {
        const errs = {};
        if (!formData.email.trim()) errs.email = 'Email is required';
        if (!formData.password || formData.password.length < 5)
            errs.password = 'Password must be at least 5 characters';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            const res = await api.post('/auth/login', formData);
            dispatch(setUser(res.data));
            toast.success('Login successful');
            redirectBasedOnRole(res.data.user.role, navigate);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="flex min-h-screen">
            <div className="w-1/2 hidden md:flex items-center justify-center bg-gray-100">
                <img src="/auth-illustration.svg" alt="Auth" className="w-3/4" />
            </div>
            <div className="w-full md:w-1/2 flex items-center justify-center">
                <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 p-6">
                    <h2 className="text-3xl font-bold text-center">Login</h2>

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="w-full p-2 border rounded"
                        onChange={handleChange}
                    />
                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="w-full p-2 border rounded"
                        onChange={handleChange}
                    />
                    {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    >
                        Login
                    </button>

                    <p className="text-center text-sm mt-2">
                        Don’t have an account?{' '}
                        <Link to="/register" className="text-blue-600 hover:underline">
                            Register
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
