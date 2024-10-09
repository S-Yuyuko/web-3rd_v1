import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { getAboutEntries, addAboutEntry, updateAboutEntry } from '../utils/api'; // Adjust import as needed
import { useNotification } from '../contexts/NotificationContext';
import { v4 as uuidv4 } from 'uuid';

type AboutInfo = {
  id: string;
  information: string;
  skills: string; // Should be a string
  education: string; // Should be a string
};

type AboutContextType = {
  aboutInfo: AboutInfo;
  setAboutInfo: (info: AboutInfo) => void;
  handleSaveAboutInfo: () => Promise<void>;
};

const AboutContext = createContext<AboutContextType | undefined>(undefined);

export const useAboutContext = () => {
  const context = useContext(AboutContext);
  if (!context) {
    throw new Error('useAboutContext must be used within an AboutProvider');
  }
  return context;
};

export const AboutProvider = ({ children }: { children: React.ReactNode }) => {
  const { showNotification } = useNotification();
  const [aboutInfo, setAboutInfo] = useState<AboutInfo>({ id: '', information: '', skills: '', education: '' });
  const hasFetched = useRef(false);

  const fetchAboutInfo = useCallback(async () => {
    try {
      const entries = await getAboutEntries();
      console.log(entries)
      if (entries.length > 0) {
        setAboutInfo(entries[0]);
      }
    } catch (error) {
      showNotification('Failed to fetch about information.', 'error');
    }
  }, [showNotification]);

  const handleSaveAboutInfo = useCallback(async () => {
    const { information, skills, education } = aboutInfo;
    if (!information || !skills || !education) {
      showNotification('Please fill in all fields: information, skills, and education.', 'error');
      return;
    }

    try {
      if (!aboutInfo.id) {
        const newAboutInfo = { ...aboutInfo, id: uuidv4() };       
        await addAboutEntry(newAboutInfo);
        showNotification('About information added successfully!', 'success');
        setAboutInfo(newAboutInfo);
      } else {
        await updateAboutEntry(aboutInfo.id, { information, skills, education });
        showNotification('About information updated successfully!', 'success');
      }
      await fetchAboutInfo();
    } catch (error) {
      showNotification('Failed to save about information.', 'error');
    }
  }, [aboutInfo, fetchAboutInfo, showNotification]);

  useEffect(() => {
    const storedIdentity = localStorage.getItem('identity');
    if (storedIdentity === 'admin' && !hasFetched.current) {
      fetchAboutInfo();
      hasFetched.current = true;
    }
  }, [fetchAboutInfo]);

  return (
    <AboutContext.Provider value={{ aboutInfo, setAboutInfo, handleSaveAboutInfo }}>
      {children}
    </AboutContext.Provider>
  );
};
