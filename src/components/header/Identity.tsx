"use client";

import { FaUser, FaUserShield } from 'react-icons/fa';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { LoginProvider, useLogin } from '@/contexts/LoginContext';
import { NotificationProvider } from '@/contexts/NotificationContext';

import Notification from '@/components/Notification';

const UserIcon = () => <FaUser className="text-3xl text-blue-500 dark:text-blue-300" />;
const AdminIcon = () => <FaUserShield className="text-3xl text-blue-500 dark:text-blue-300" />;

function IdentityContent() {
  const { handleLogout } = useLogin();
  const [hovered, setHovered] = useState(false);
  const [identity, setIdentity] = useState('user');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedIdentity = localStorage.getItem('identity') || 'user';
      setIdentity(storedIdentity);
    }
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (typeof window !== 'undefined') {
        const storedIdentity = localStorage.getItem('identity') || 'user';
        if (storedIdentity !== identity) {
          setIdentity(storedIdentity);
          console.log(`Identity changed to: ${storedIdentity}`);
        }
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [identity]);

  return (
    <div
      className="relative flex items-center space-x-4"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-center space-x-2 cursor-pointer">
        {identity === 'admin' ? <AdminIcon /> : <UserIcon />}
      </div>

      {hovered && (
        <div
          className="absolute right-0 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10"
          style={{ top: '100%' }}
        >
          {identity === 'admin' ? (
            <>
              <Link href="/admincontent" passHref>
                <button className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700">
                  My Content
                </button>
              </Link>
              <button
                className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={handleLogout}
              >
                Log Out
              </button>
            </>
          ) : (
            <Link href="/login" passHref>
              <button className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700">
                Change to Admin
              </button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default function Identity() {
  return (
    <NotificationProvider>
      <LoginProvider>
        <IdentityContent />
        <Notification />
      </LoginProvider>
    </NotificationProvider>
  );
}
