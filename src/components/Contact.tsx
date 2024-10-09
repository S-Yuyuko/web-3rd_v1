"use client"

import React, { useEffect, useState } from 'react';
import { getContactEntries } from '../utils/api'; // Adjust the import path as needed
import { FaTimes, FaPhoneAlt, FaEnvelope, FaLinkedin, FaGithub } from 'react-icons/fa'; // Updated icons

interface ContactInfo {
  id: string;
  phone: string;
  email: string;
  linkedin: string; // Use external LinkedIn URL
  github: string;   // Use external GitHub URL
}

const Contact: React.FC = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [openDialog, setOpenDialog] = useState<'phone' | 'email' | null>(null);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const data: ContactInfo[] = await getContactEntries();
        if (data.length > 0) {
          setContactInfo(data[0]); // Assuming you want the first entry
        }
      } catch (error) {
        console.error('Error fetching contact information:', error);
      }
    };

    fetchContactInfo();
  }, []);

  const handleIconClick = (type: 'phone' | 'email') => {
    setOpenDialog(type);
  };

  if (!contactInfo) {
    return null;
  }

  return (
    <div className="fixed bottom-5 right-5 flex flex-col space-y-2">
      <FaPhoneAlt
        onClick={() => handleIconClick('phone')}
        className="text-blue-600 dark:text-blue-400 cursor-pointer hover:text-blue-700 dark:hover:text-blue-500"
        size={30}
      />
      <FaEnvelope
        onClick={() => handleIconClick('email')}
        className="text-blue-600 dark:text-blue-400 cursor-pointer hover:text-blue-700 dark:hover:text-blue-500"
        size={30}
      />
      <FaLinkedin
        onClick={() => window.open(contactInfo.linkedin, '_blank')}
        className="text-blue-600 dark:text-blue-400 cursor-pointer hover:text-blue-700 dark:hover:text-blue-500"
        size={30}
      />
      <FaGithub
        onClick={() => window.open(contactInfo.github, '_blank')}
        className="text-blue-600 dark:text-blue-400 cursor-pointer hover:text-blue-700 dark:hover:text-blue-500"
        size={30}
      />

      {/* Dialog */}
      {openDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg w-64 relative">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">
              {openDialog === 'phone' ? 'Phone Number' : 'Email Address'}
            </h2>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              {openDialog === 'phone' ? contactInfo.phone : contactInfo.email}
            </p>
            <button
              onClick={() => setOpenDialog(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-400"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contact;
