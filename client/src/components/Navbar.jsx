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
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Edify<span className="text-gray-700">Pro</span>
        </Link>

        <div className="flex gap-4 items-center">
          {!user && (
            <>
              <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-blue-600">Login</Link>
              <Link to="/register" className="text-sm font-medium text-gray-700 hover:text-blue-600">Register</Link>
            </>
          )}

          {user && (
            <>
              {user.role === 'student' && (
                <Link to="/student/dashboard" className="text-sm text-gray-700 hover:text-blue-600">Student Dashboard</Link>
              )}
              {user.role === 'instructor' && (
                <Link to="/instructor/dashboard" className="text-sm text-gray-700 hover:text-blue-600">Instructor Dashboard</Link>
              )}
              {user.role === 'admin' && (
                <Link to="/admin/dashboard" className="text-sm text-gray-700 hover:text-blue-600">Admin Dashboard</Link>
              )}
              <button onClick={handleLogout} className="text-sm font-medium text-red-500 hover:underline">Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
