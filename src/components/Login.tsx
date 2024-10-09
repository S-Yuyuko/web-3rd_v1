"use client";

import { FaUser, FaLock } from 'react-icons/fa';
import Link from 'next/link';
import { LoginProvider, useLogin } from '@/contexts/LoginContext'; // Import LoginProvider
import { NotificationProvider } from '@/contexts/NotificationContext'; // Import NotificationProvider
import Notification from '../components/Notification';

function LoginContent() {
  const { credentials, setCredentials, handleLogin } = useLogin();

  const handleCredentialsChange = (field: 'account' | 'password') => (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials((prev) => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-md w-full max-w-md">
        <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100">Administrator Login</h2>
        
        <div className="flex items-center mb-4">
          <FaUser className="text-gray-500 dark:text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Account"
            value={credentials.account}
            onChange={handleCredentialsChange('account')}
            className="w-full px-3 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex items-center mb-4">
          <FaLock className="text-gray-500 dark:text-gray-400 mr-2" />
          <input
            type="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleCredentialsChange('password')}
            className="w-full px-3 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex justify-end space-x-2">
          <Link href="/" passHref>
            <button type="button" className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-md hover:bg-gray-400 dark:hover:bg-gray-600">
              Cancel
            </button>
          </Link>
          <button
            type="button"
            onClick={handleLogin}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <NotificationProvider>
      <LoginProvider>
        <LoginContent />
        <Notification />
      </LoginProvider>
    </NotificationProvider>
  );
}
