import { NavLink } from 'react-router-dom';

const InstructorSidebar = () => {
  return (
    <div className="w-64 bg-white shadow-md p-4">
      <h2 className="text-xl font-bold mb-4">Instructor</h2>
      <nav className="flex flex-col space-y-2">
        <NavLink
          to="/instructor/dashboard"
          className={({ isActive }) =>
            isActive ? 'text-blue-600 font-semibold' : 'text-gray-700'
          }
          end
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/instructor/dashboard/courses"
          className={({ isActive }) =>
            isActive ? 'text-blue-600 font-semibold' : 'text-gray-700'
          }
        >
          My Courses
        </NavLink>
        <NavLink
          to="/instructor/dashboard/create-course"
          className={({ isActive }) =>
            isActive ? 'text-blue-600 font-semibold' : 'text-gray-700'
          }
        >
          Create Course
        </NavLink>
      </nav>
    </div>
  );
};

export default InstructorSidebar;
