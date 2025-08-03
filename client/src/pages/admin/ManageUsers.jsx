import { useEffect, useState } from 'react';
import api from '../../api/api';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      toast.error('Failed to fetch users');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleBan = async (userId, currentStatus) => {
    try {
      await api.put(`/admin/user/${userId}/status`, {
        isBanned: !currentStatus,
      });
      toast.success(`User ${!currentStatus ? 'banned' : 'unbanned'} successfully`);
      fetchUsers();
    } catch (err) {
      toast.error('Failed to update user status');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="py-10 px-4 sm:px-6 lg:px-8"
    >
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Manage Users</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-xl shadow-sm">
          <thead className="bg-red-700 text-white">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-center">Role</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id} className="border-t hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-gray-800">{user.name}</td>
                  <td className="px-4 py-3 text-gray-600">{user.email}</td>
                  <td className="px-4 py-3 text-center capitalize text-gray-700">{user.role}</td>
                  <td className="px-4 py-3 text-center">
                    {user.isBanned ? (
                      <span className="inline-block px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                        Banned
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleBan(user._id, user.isBanned)}
                      className={`px-4 py-1 rounded text-white font-semibold text-sm transition ${
                        user.isBanned
                          ? 'bg-green-600 hover:bg-green-700'
                          : 'bg-red-600 hover:bg-red-700'
                      }`}
                    >
                      {user.isBanned ? 'Unban' : 'Ban'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default AdminUsers;
