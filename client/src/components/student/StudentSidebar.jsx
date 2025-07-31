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
    <div className="bg-blue-800 text-white min-h-screen">
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
                className={`block px-2 py-1 rounded hover:bg-blue-700 ${
                  location.pathname === link.path ? 'bg-blue-700' : ''
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

export default StudentSidebar;
