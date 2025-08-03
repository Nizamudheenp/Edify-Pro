import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { FaBars } from 'react-icons/fa';

const StudentSidebar = () => {
  const [open, setOpen] = useState(true);
  const location = useLocation();

  const links = [
    { path: '/student/dashboard', label: 'Dashboard' },
    { path: '/student/dashboard/my-courses', label: 'My Courses' },
    { path: '/student/dashboard/progress', label: 'Progress' },
    { path: '/student/dashboard/courses', label: 'Browse Courses' },
  ];

   return (
    <div className={`bg-blue-800 text-white transition-all duration-300 ${open ? 'w-64' : 'w-16'} min-h-screen flex flex-col`}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-blue-700">
        <button onClick={() => setOpen(!open)} className="text-white">
          <FaBars />
        </button>
        {open && <h2 className="text-lg font-semibold">Student</h2>}
      </div>

      <ul className="flex-1 p-4 space-y-2">
        {links.map((link) => (
          <li key={link.path}>
            <Link
              to={link.path}
              className={`block px-3 py-2 rounded transition ${
                location.pathname === link.path
                  ? 'bg-white text-blue-800 font-medium'
                  : 'hover:bg-blue-700'
              }`}
            >
              {open ? link.label : <span className="sr-only">{link.label}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentSidebar;
