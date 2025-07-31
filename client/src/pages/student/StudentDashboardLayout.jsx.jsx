import { Outlet } from 'react-router-dom';
import StudentSidebar from '../../components/student/StudentSidebar';

const StudentDashboardLayout = () => {
  return (
    <div className="flex">
      <StudentSidebar />
      <div className="flex-1 p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default StudentDashboardLayout;
