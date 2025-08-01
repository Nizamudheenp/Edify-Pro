import { Outlet } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';

const AdminDashboardLayout = () => {
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
