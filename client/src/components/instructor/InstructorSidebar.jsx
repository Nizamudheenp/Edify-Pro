import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const { pathname } = useLocation();

  return (
    <aside className="bg-gray-900 text-white w-60 p-4 min-h-screen">
      <h2 className="text-xl font-bold mb-6">Instructor</h2>
      <nav className="space-y-3">
        <Link to="/instructor" className={pathname === '/instructor' ? 'text-yellow-400' : ''}>Dashboard</Link>
        <Link to="/instructor/create-course" className={pathname.includes('create-course') ? 'text-yellow-400' : ''}>Create Course</Link>
        <Link to="/instructor/courses" className={pathname.includes('courses') ? 'text-yellow-400' : ''}>My Courses</Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
