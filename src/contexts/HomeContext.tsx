import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { uploadSlide, getSlidePictures, deleteSlidePicture, getHomeWords, addHomeWord, updateHomeWord } from '../utils/api';
import { useNotification } from '../contexts/NotificationContext';

type HomeWord = {
  id: string;
  title: string;
  description: string;
};

type HomeContextType = {
  previewUrl: string | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUpload: () => Promise<void>;
  handleCancel: () => void;
  slidePictures: { name: string; path: string }[];
  homeWord: HomeWord;
  setHomeWord: (word: HomeWord) => void;
  handleSaveHomeWord: () => Promise<void>;
  handleDeletePicture: (name: string) => Promise<void>;
};

const HomeContext = createContext<HomeContextType | undefined>(undefined);

export const useHomeContext = () => {
  const context = useContext(HomeContext);
  if (!context) {
    throw new Error('useHomeContext must be used within a HomeProvider');
  }
  return context;
};

export const HomeProvider = ({ children }: { children: React.ReactNode }) => {
  const { showNotification } = useNotification();
  const hasFetched = useRef(false);

  const [homeWord, setHomeWord] = useState<HomeWord>({ id: '', title: '', description: '' });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [slidePictures, setSlidePictures] = useState<{ name: string; path: string }[]>([]);

  const fetchHomeWords = useCallback(async () => {
    try {
      const words = await getHomeWords(); // Assuming 'words' is returned as an object
      console.log('Words data:', words); // Debugging
  
      // Convert the object to an array if it's not already an array
      const wordsArray = Array.isArray(words) ? words : [words];
  
      // Check if wordsArray has the expected structure
      if (wordsArray.length > 0) {
        setHomeWord(wordsArray[0]); // Use the first word in the array
      } else {
        console.error('Words array is empty or has invalid structure.');
      }
    } catch (error) {
      showNotification('Failed to fetch home words.', 'error');
    }
  }, [showNotification]);
  
  const handleSaveHomeWord = useCallback(async () => {
    const { title, description } = homeWord;
    if (!title || !description) {
      showNotification('Please enter both title and description.', 'error');
      return;
    }

    try {
      if (!homeWord.id) {
        const newWord = { ...homeWord, id: uuidv4() };
        await addHomeWord(newWord);
        showNotification('Home word added successfully!', 'success');
        setHomeWord(newWord);
      } else {
        await updateHomeWord(homeWord.id, { title, description });
        showNotification('Home word updated successfully!', 'success');
      }
      await fetchHomeWords();
    } catch (error) {
      showNotification('Failed to save home word.', 'error');
    }
  }, [homeWord, fetchHomeWords, showNotification]);

  const fetchSlidePictures = useCallback(async () => {
    try {
      const pictures = await getSlidePictures();
      setSlidePictures(pictures);
    } catch (error) {
      showNotification('Failed to fetch pictures.', 'error');
    }
  }, [showNotification]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const filePreviewUrl = URL.createObjectURL(file);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(filePreviewUrl);
      setFileName(file.name);
    }
  }, [previewUrl]);

  const handleCancel = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setFileName(null);
  }, [previewUrl]);
  
  const handleUpload = useCallback(async () => {
    if (!previewUrl || !fileName) {
      showNotification('Please select a file.', 'error');
      return;
    }
  
    try {
      const blob = await fetch(previewUrl).then((res) => res.blob());
      const uniqueFileName = `${Date.now()}.${fileName.split('.').pop()}`;
  
      const file = new File([blob], uniqueFileName, { type: blob.type });
      const formData = new FormData();
      formData.append('file', file);
  
      await uploadSlide(formData);
      showNotification('Upload successful!', 'success');
      handleCancel(); // Cancel file preview after upload
      await fetchSlidePictures();
    } catch (error) {
      showNotification('Failed to upload file.', 'error');
    }
  }, [previewUrl, fileName, fetchSlidePictures, showNotification, handleCancel]);
  
  const handleDeletePicture = useCallback(async (name: string) => {
    try {
      await deleteSlidePicture(name);
      showNotification('Picture deleted successfully.', 'success');
      await fetchSlidePictures();
    } catch (error) {
      showNotification('Failed to delete picture.', 'error');
    }
  }, [fetchSlidePictures, showNotification]);

  useEffect(() => {
    const storedIdentity = localStorage.getItem('identity');
    if (storedIdentity === 'admin' && !hasFetched.current) {
      fetchSlidePictures();
      fetchHomeWords();
      hasFetched.current = true;
    }
  }, [fetchSlidePictures, fetchHomeWords]);

  return (
    <HomeContext.Provider
      value={{
        homeWord,
        setHomeWord,
        handleSaveHomeWord,
        previewUrl,
        handleFileChange,
        handleUpload,
        handleCancel,
        slidePictures,
        handleDeletePicture,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
};
