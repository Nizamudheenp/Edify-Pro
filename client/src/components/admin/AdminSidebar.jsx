// src/components/admin/AdminSidebar.jsx
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
    { path: '/admin/dashboard/reports', label: 'Reports' },
  ];

  return (
    <div className="bg-red-800 text-white min-h-screen">
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
                className={`block px-2 py-1 rounded hover:bg-red-700 ${
                  location.pathname === link.path ? 'bg-red-700' : ''
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

export default AdminSidebar;
