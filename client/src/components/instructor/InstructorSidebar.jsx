// src/components/instructor/InstructorSidebar.jsx
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { FaBars } from 'react-icons/fa';

const InstructorSidebar = () => {
  const [open, setOpen] = useState(true);
  const location = useLocation();

  const links = [
    { path: '/instructor/dashboard', label: 'Dashboard' },
    { path: '/instructor/dashboard/courses', label: 'My Courses' },
    { path: '/instructor/dashboard/create-course', label: 'Create Course' },
  ];

  return (
    <div className={`bg-gray-800 text-white transition-all duration-300 ${open ? 'w-64' : 'w-16'} min-h-screen flex flex-col`}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
        <button onClick={() => setOpen(!open)} className="text-white">
          <FaBars />
        </button>
        {open && <h2 className="text-lg font-semibold">Instructor</h2>}
      </div>

      <ul className="flex-1 p-4 space-y-2">
        {links.map((link) => (
          <li key={link.path}>
            <Link
              to={link.path}
              className={`block px-3 py-2 rounded transition ${
                location.pathname === link.path
                  ? 'bg-white text-gray-900 font-medium'
                  : 'hover:bg-gray-700'
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

export default InstructorSidebar;
