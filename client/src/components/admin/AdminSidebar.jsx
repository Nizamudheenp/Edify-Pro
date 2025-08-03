import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';

const AdminSidebar = () => {
  const [open, setOpen] = useState(true);
  const location = useLocation();

  const links = [
    { path: '/admin/dashboard', label: 'Dashboard' },
    { path: '/admin/dashboard/users', label: 'Manage Users' },
    { path: '/admin/dashboard/courses', label: 'Manage Courses' },
  ];

  return (
    <div className={`bg-red-900 text-white transition-all duration-300 ${open ? 'w-64' : 'w-16'} shadow-lg min-h-screen`}>
      <div className="flex items-center justify-between p-4 border-b border-red-700">
        <h2 className={`text-lg font-bold transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 hidden'}`}>
          Admin
        </h2>
        <button onClick={() => setOpen(!open)} className="text-white text-xl focus:outline-none">
          <FaBars />
        </button>
      </div>
      <nav className="p-4 space-y-2">
        {links.map(link => (
          <Link
            key={link.path}
            to={link.path}
            className={`block px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 
              ${
                location.pathname === link.path
                  ? 'bg-red-700 text-white'
                  : 'hover:bg-red-800 text-white/80'
              }`}
          >
            {open ? link.label : <span className="block w-2 h-2 bg-white rounded-full mx-auto"></span>}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;
