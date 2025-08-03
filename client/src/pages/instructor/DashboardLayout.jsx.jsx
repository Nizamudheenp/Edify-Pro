import { Outlet } from 'react-router-dom';
import InstructorSidebar from '../../components/instructor/InstructorSidebar';

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <InstructorSidebar />
      <main className="flex-1 p-6 md:p-10 bg-white shadow-inner rounded-tl-3xl">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
