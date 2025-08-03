import { Outlet } from 'react-router-dom';
import StudentSidebar from '../../components/student/StudentSidebar';

const StudentDashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudentSidebar />
      <div className="flex-1 p-4 md:p-8 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default StudentDashboardLayout;
