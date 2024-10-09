import { FaPen, FaTrashAlt } from 'react-icons/fa';
import { useAdminContext, AdminProvider } from '@/contexts/AdminContext'; // Import AdminProvider and useAdminContext
import { NotificationProvider } from '@/contexts/NotificationContext';

import Notification from '@/components/Notification';

const AdminsSectionContent = () => {
  const {
    admins,
    newAdmin,
    setNewAdmin,
    isNewAdminVisible,
    setIsNewAdminVisible,
    handleAddAdmin,
    handleDeleteAdmin,
    editAdmin,
    setEditAdmin,
    editPassword,
    setEditPassword,
    handleUpdatePassword,
  } = useAdminContext();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Admins</h2>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mb-4"
        onClick={() => setIsNewAdminVisible(!isNewAdminVisible)}
      >
        {isNewAdminVisible ? 'Cancel New Admin' : 'Add New Admin'}
      </button>

      {isNewAdminVisible && (
        <div className="mb-4">
          <div className="mb-2">
            <label className="block">Account:</label>
            <input
              type="text"
              value={newAdmin.account}
              onChange={(e) => setNewAdmin({ ...newAdmin, account: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block">Password:</label>
            <input
              type="password"
              value={newAdmin.password}
              onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <button onClick={handleAddAdmin} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
            Add Admin
          </button>
        </div>
      )}

      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border px-4 py-2">Account</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{admin.account}</td>
              <td className="border px-4 py-2 flex space-x-4">
                <button
                  onClick={() => setEditAdmin(admin.account)}
                  className="flex items-center text-blue-500 hover:text-blue-700 focus:outline-none"
                >
                  <FaPen className="mr-2" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteAdmin(admin.account)}
                  className="flex items-center text-red-500 hover:text-red-700 focus:outline-none"
                >
                  <FaTrashAlt className="mr-2" />
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editAdmin && (
        <div className="mt-4 p-4 border rounded-md bg-gray-100">
          <h3 className="text-lg font-bold mb-2">Edit Password for {editAdmin}</h3>
          <div className="mb-4">
            <label className="block">New Password:</label>
            <input
              type="password"
              value={editPassword}
              onChange={(e) => setEditPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <button
            onClick={handleUpdatePassword}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Update Password
          </button>
          <button
            onClick={() => setEditAdmin(null)}
            className="px-4 py-2 ml-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

// Wrap the AdminsSection component with the AdminProvider
export default function AdminsSection() {
  return (
    <NotificationProvider>
      <AdminProvider>
        <AdminsSectionContent />
        <Notification />
      </AdminProvider>
    </NotificationProvider>
  );
}
