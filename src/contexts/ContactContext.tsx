import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { getContactEntries, addContactEntry, updateContactEntry } from '../utils/api'; // Adjust import as needed
import { useNotification } from '../contexts/NotificationContext';
import { v4 as uuidv4 } from 'uuid';

type ContactInfo = {
  id: string;
  phone: string;
  email: string;
  linkedin: string;
  github: string;
};

type ContactContextType = {
  contactInfo: ContactInfo;
  setContactInfo: (info: ContactInfo) => void;
  handleSaveContactInfo: () => Promise<void>;
};

const ContactContext = createContext<ContactContextType | undefined>(undefined);

export const useContactContext = () => {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error('useContactContext must be used within a ContactProvider');
  }
  return context;
};

export const ContactProvider = ({ children }: { children: React.ReactNode }) => {
  const { showNotification } = useNotification();
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    id: '',
    phone: '',
    email: '',
    linkedin: '',
    github: '',
  });
  const hasFetched = useRef(false);

  const fetchContactInfo = useCallback(async () => {
    try {
      const entries = await getContactEntries();
      if (entries.length > 0) {
        setContactInfo(entries[0]);
      }
    } catch (error) {
      showNotification('Failed to fetch contact information.', 'error');
    }
  }, [showNotification]);

  const handleSaveContactInfo = useCallback(async () => {
    const { phone, email, linkedin, github } = contactInfo;
    if (!phone || !email || !linkedin || !github) {
      showNotification('Please fill in all fields: phone number, email, LinkedIn, and GitHub.', 'error');
      return;
    }

    try {
      if (!contactInfo.id) {
        const newContactInfo = { ...contactInfo, id: uuidv4() };       
        await addContactEntry(newContactInfo);
        showNotification('Contact information added successfully!', 'success');
        setContactInfo(newContactInfo);
      } else {
        await updateContactEntry(contactInfo.id, { phone, email, linkedin, github });
        showNotification('Contact information updated successfully!', 'success');
      }
      await fetchContactInfo();
    } catch (error) {
      showNotification('Failed to save contact information.', 'error');
    }
  }, [contactInfo, fetchContactInfo, showNotification]);

  useEffect(() => {
    const storedIdentity = localStorage.getItem('identity');
    if (storedIdentity === 'admin' && !hasFetched.current) {
      fetchContactInfo();
      hasFetched.current = true;
    }
  }, [fetchContactInfo]);

  return (
    <ContactContext.Provider value={{ contactInfo, setContactInfo, handleSaveContactInfo }}>
      {children}
    </ContactContext.Provider>
  );
};
