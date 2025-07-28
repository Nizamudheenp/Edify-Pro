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
    <div className="bg-gray-800 text-white min-h-screen">
      <button
        className="p-2 m-2 text-white focus:outline-none"
        onClick={() => setOpen(!open)}
      >
        <FaBars />
      </button>
      {open && (
        <ul className="space-y-2 p-4">
          {links.map(link => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`block px-2 py-1 rounded hover:bg-gray-700 ${
                  location.pathname === link.path ? 'bg-gray-700' : ''
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InstructorSidebar;
