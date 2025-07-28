import { Outlet } from 'react-router-dom';
import InstructorSidebar from '../../components/instructor/InstructorSidebar';

const DashboardLayout = () => {
  return (
    <div className="flex">
      <InstructorSidebar />
      <div className="flex-1 p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
