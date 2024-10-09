import { createContext, useContext, useState, ReactNode, useEffect, useCallback, useMemo } from 'react';
import { fetchAdmins, addAdmin, deleteAdmin, updateAdmin } from '../utils/routes/admin';
import { useNotification } from './NotificationContext'; // Import centralized NotificationContext

type AdminContextType = {
  admins: Array<{ account: string }>;
  newAdmin: { account: string; password: string };
  setNewAdmin: (newAdmin: { account: string; password: string }) => void;
  handleAddAdmin: () => Promise<void>;
  handleDeleteAdmin: (account: string) => Promise<void>;
  handleUpdatePassword: () => Promise<void>;
  isNewAdminVisible: boolean;
  setIsNewAdminVisible: (visible: boolean) => void;
  editAdmin: string | null;
  setEditAdmin: (account: string | null) => void;
  editPassword: string;
  setEditPassword: (password: string) => void;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdminContext = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdminContext must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  const [admins, setAdmins] = useState<Array<{ account: string }>>([]);
  const [newAdmin, setNewAdmin] = useState({ account: '', password: '' });
  const [isNewAdminVisible, setIsNewAdminVisible] = useState(false);
  const [editAdmin, setEditAdmin] = useState<string | null>(null);
  const [editPassword, setEditPassword] = useState<string>('');
  const { showNotification } = useNotification();

  const handleError = useCallback((error: unknown, defaultMessage: string) => {
    if (error instanceof Error) {
      showNotification(error.message, 'error');
    } else {
      showNotification(defaultMessage, 'error');
    }
  }, [showNotification]);

  const loadAdmins = useCallback(async () => {
    try {
      const fetchedAdmins = await fetchAdmins();
      setAdmins(fetchedAdmins);
    } catch (error) {
      handleError(error, 'Failed to load admins.');
    }
  }, [handleError]);

  useEffect(() => {
    const storedIdentity = localStorage.getItem('identity');
    if (storedIdentity === 'admin') {
      loadAdmins(); // Only load admins if the identity is 'admin'
    }
  }, [loadAdmins]);

  const handleAddAdmin = useCallback(async () => {
    try {
      await addAdmin(newAdmin.account, newAdmin.password);
      await loadAdmins();
      setNewAdmin({ account: '', password: '' });
      showNotification('Admin added successfully', 'success');
    } catch (error) {
      handleError(error, 'Failed to add admin.');
    }
  }, [newAdmin, loadAdmins, showNotification, handleError]);

  const handleDeleteAdmin = useCallback(async (account: string) => {
    try {
      await deleteAdmin(account);
      await loadAdmins();
      showNotification('Admin deleted successfully', 'success');
    } catch (error) {
      handleError(error, 'Failed to delete admin.');
    }
  }, [loadAdmins, showNotification, handleError]);

  const handleUpdatePassword = useCallback(async () => {
    if (editAdmin && editPassword) {
      try {
        await updateAdmin(editAdmin, editPassword);
        await loadAdmins();
        setEditAdmin(null);
        setEditPassword('');
        showNotification('Password updated successfully', 'success');
      } catch (error) {
        handleError(error, 'Failed to update password.');
      }
    }
  }, [editAdmin, editPassword, loadAdmins, showNotification, handleError]);

  const contextValue = useMemo(
    () => ({
      admins,
      newAdmin,
      setNewAdmin,
      handleAddAdmin,
      handleDeleteAdmin,
      handleUpdatePassword,
      isNewAdminVisible,
      setIsNewAdminVisible,
      editAdmin,
      setEditAdmin,
      editPassword,
      setEditPassword,
    }),
    [
      admins,
      newAdmin,
      handleAddAdmin,
      handleDeleteAdmin,
      handleUpdatePassword,
      isNewAdminVisible,
      setIsNewAdminVisible,
      editAdmin,
      setEditAdmin,
      editPassword,
      setEditPassword,
    ]
  );

  return <AdminContext.Provider value={contextValue}>{children}</AdminContext.Provider>;
};
