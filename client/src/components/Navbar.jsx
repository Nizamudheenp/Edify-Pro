import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600 tracking-tight">
          Edify<span className="text-gray-800">Pro</span>
        </Link>

        <div className="flex items-center space-x-5 text-sm font-medium">
          {!user ? (
            <>
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              {user.role === 'student' && (
                <Link
                  to="/student/dashboard"
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  My Courses
                </Link>
              )}
              {user.role === 'instructor' && (
                <Link
                  to="/instructor/dashboard"
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  Instructor Panel
                </Link>
              )}
              {user.role === 'admin' && (
                <Link
                  to="/admin/dashboard"
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  Admin Panel
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-red-500 hover:underline transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
