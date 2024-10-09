"use client"

import { useEffect } from 'react';
import { useNotification } from '../contexts/NotificationContext'; // Import from the centralized NotificationContext

const Notification = () => {
  const { notification, clearNotification } = useNotification();

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        clearNotification();
      }, 3000);
      return () => clearTimeout(timer); // Clean up the timer when the component unmounts
    }
  }, [notification, clearNotification]);

  if (!notification) return null;

  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 z-50 rounded-md shadow-md ${
        notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
      } text-white`}
    >
      {notification.message}
    </div>
  );
};

export default Notification;
