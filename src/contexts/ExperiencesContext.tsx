"use client";

import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { fetchProjects, addProject, deleteProject, updateProject, fetchProfessionals, addProfessional, deleteProfessional, updateProfessional } from '@/utils/api';
import { addExperienceWord, updateExperienceWord, getExperienceWords } from '../utils/api';
import { useNotification } from './NotificationContext';
import { v4 as uuidv4 } from 'uuid';

// Types
type ExperienceWord = { id: string; title: string; description: string; };
type Project = { id: string; title: string; startTime: string | null; endTime: string | null; skills: string | null; link: string | null; description: string | null; media: (string | File)[]; };
type Professional = { id: string; title: string; startTime: string | null; endTime: string | null; skills: string | null; company: string | null; description: string | null; media: (string | File)[]; };

type ExperiencesContextType = { 
  projects: Project[]; professionals: Professional[]; 
  newProject: Project; newProfessional: Professional; 
  experienceWord: ExperienceWord; 
  setExperienceWord: (word: ExperienceWord) => void; 
  handleSaveExperienceWord: () => Promise<void>; 
  setNewProject: (newProject: Project) => void; 
  setNewProfessional: (newProfessional: Professional) => void; 
  handleAddOrUpdateProject: (isEdit?: boolean) => Promise<void>; 
  handleAddOrUpdateProfessional: (isEdit?: boolean) => Promise<void>; 
  handleDeleteProject: (id: string) => Promise<void>; 
  handleDeleteProfessional: (id: string) => Promise<void>; 
  handleProjectMediaChange: (e: React.ChangeEvent<HTMLInputElement>, projectType: 'new' | 'edit') => void; 
  handleProfessionalMediaChange: (e: React.ChangeEvent<HTMLInputElement>, projectType: 'new' | 'edit') => void; 
  isNewProjectVisible: boolean; isNewProfessionalVisible: boolean; 
  setIsNewProjectVisible: (visible: boolean) => void; 
  setIsNewProfessionalVisible: (visible: boolean) => void; 
  editProject: Project | null; editProfessional: Professional | null; 
  setEditProject: (project: Project | null) => void; 
  setEditProfessional: (professional: Professional | null) => void; 
  removeProjectMedia: (projectType: 'new' | 'edit', index: number) => void; 
  removeProfessionalMedia: (projectType: 'new' | 'edit', index: number) => void; 
};

// Create context
const ExperiencesContext = createContext<ExperiencesContextType | undefined>(undefined);

export const useExperiencesContext = () => {
  const context = useContext(ExperiencesContext);
  if (!context) {
    throw new Error('useExperiencesContext must be used within an ExperiencesProvider');
  }
  return context;
};

export const ExperiencesProvider = ({ children }: { children: React.ReactNode }) => {
  // State Management
  const [projects, setProjects] = useState<Project[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  
  const [newProject, setNewProject] = useState<Project>(initializeNewProject());
  const [newProfessional, setNewProfessional] = useState<Professional>(initializeNewProfessional());
  
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [editProfessional, setEditProfessional] = useState<Professional | null>(null);
  
  const [isNewProjectVisible, setIsNewProjectVisible] = useState(false);
  const [isNewProfessionalVisible, setIsNewProfessionalVisible] = useState(false);
  
  const [experienceWord, setExperienceWord] = useState<ExperienceWord>({ id: '', title: '', description: '' });
  
  const hasFetched = useRef(false);  
  const { showNotification } = useNotification();

  // Initialization Functions
  function initializeNewProject(): Project {
    return { id: '', title: '', startTime: null, endTime: null, skills: null, link: null, description: null, media: [] };
  }

  function initializeNewProfessional(): Professional {
    return { id: '', title: '', startTime: null, endTime: null, skills: null, company: null, description: null, media: [] };
  }

  // Reset Functions
  const resetProjectState = useCallback(() => { 
    setNewProject(initializeNewProject()); 
    setEditProject(null); 
  }, []);

  const resetProfessionalState = useCallback(() => { 
    setNewProfessional(initializeNewProfessional()); 
    setEditProfessional(null); 
  }, []);

  const fetchExperienceWords = useCallback(async () => {
    try {
      const words = await getExperienceWords();
      
      // Convert the object to an array if it's not already an array
      const wordsArray = Array.isArray(words) ? words : [words];
  
      if (wordsArray.length > 0) {
        setExperienceWord(wordsArray[0]); // Use the first word in the array
      } else {
        console.error('Experience words array is empty or has invalid structure.');
      }
    } catch (error) {
      showNotification('Failed to fetch experience words.', 'error');
    }
  }, [showNotification]);
  
  const handleSaveExperienceWord = useCallback(async () => {
    const { title, description } = experienceWord;
    if (!title || !description) {
      showNotification('Please enter both title and description.', 'error');
      return;
    }

    try {
      if (!experienceWord.id) {
        const newWord = { ...experienceWord, id: uuidv4() };
        await addExperienceWord(newWord);
        showNotification('Experience word added successfully!', 'success');
        setExperienceWord(newWord);
      } else {
        await updateExperienceWord(experienceWord.id, { title, description });
        showNotification('Experience word updated successfully!', 'success');
      }
      await fetchExperienceWords();
    } catch (error) {
      showNotification('Failed to save experience word.', 'error');
    }
  }, [experienceWord, fetchExperienceWords, showNotification]);

  // Projects
  const loadProjects = useCallback(async () => {
    try {
      const fetchedProjects = await fetchProjects();
      setProjects(fetchedProjects || []);
    } catch (error) {
      showNotification('Failed to load projects.', 'error');
    }
  }, [showNotification]);

  const handleAddOrUpdateProject = useCallback(async (isEdit = false) => {
    try {
      const projectToSave = isEdit && editProject ? editProject : { ...newProject, id: uuidv4() };
      const mediaUrls = projectToSave.media.filter((media): media is string => typeof media === 'string');
      const mediaFiles = projectToSave.media.filter((media): media is File => media instanceof File);

      const sanitizedProject = { ...projectToSave, media: mediaUrls };
      if (isEdit) {
        await updateProject(editProject!.id, sanitizedProject, mediaFiles);
      } else {
        await addProject(sanitizedProject, mediaFiles);
      }
      await loadProjects();
      resetProjectState();
      showNotification(isEdit ? 'Project updated successfully' : 'Project added successfully', 'success');
    } catch (error) {
      showNotification(isEdit ? 'Failed to update project.' : 'Failed to add project.', 'error');
    }
  }, [newProject, editProject, loadProjects, showNotification, resetProjectState]);

  const handleDeleteProject = useCallback(async (id: string) => {
    try {
      await deleteProject(id);
      await loadProjects();
      showNotification('Project deleted successfully', 'success');
    } catch (error) {
      showNotification('Failed to delete project.', 'error');
    }
  }, [loadProjects, showNotification]);

  const handleProjectMediaChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, projectType: 'new' | 'edit') => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      if (projectType === 'new') {
        setNewProject((prevProject) => ({ ...prevProject, media: [...prevProject.media, ...selectedFiles] }));
      } else if (editProject) {
        setEditProject((prevProject) => ({ ...prevProject!, media: [...prevProject!.media, ...selectedFiles] }));
      }
    }
  }, [editProject]);

  const removeProjectMedia = useCallback((projectType: 'new' | 'edit', index: number) => {
    if (projectType === 'new') {
      setNewProject((prevProject) => ({ ...prevProject, media: prevProject.media.filter((_, i) => i !== index) }));
    } else if (editProject) {
      setEditProject((prevProject) => ({ ...prevProject!, media: prevProject!.media.filter((_, i) => i !== index) }));
    }
  }, [editProject]);

  // Professionals
  const loadProfessionals = useCallback(async () => {
    try {
      const fetchedProfessionals = await fetchProfessionals();
      setProfessionals(fetchedProfessionals || []);
    } catch (error) {
      showNotification('Failed to load professionals.', 'error');
    }
  }, [showNotification]);

  const handleAddOrUpdateProfessional = useCallback(async (isEdit = false) => {
    try {
      const professionalToSave = isEdit && editProfessional ? editProfessional : { ...newProfessional, id: uuidv4() };
      const mediaUrls = professionalToSave.media.filter((media): media is string => typeof media === 'string');
      const mediaFiles = professionalToSave.media.filter((media): media is File => media instanceof File);

      const sanitizedProfessional = { ...professionalToSave, media: mediaUrls };
      if (isEdit) {
        await updateProfessional(editProfessional!.id, sanitizedProfessional, mediaFiles);
      } else {
        await addProfessional(sanitizedProfessional, mediaFiles);
      }
      await loadProfessionals();
      resetProfessionalState();
      showNotification(isEdit ? 'Professional updated successfully' : 'Professional added successfully', 'success');
    } catch (error) {
      showNotification(isEdit ? 'Failed to update professional.' : 'Failed to add professional.', 'error');
    }
  }, [newProfessional, editProfessional, loadProfessionals, showNotification, resetProfessionalState]);

  const handleDeleteProfessional = useCallback(async (id: string) => {
    try {
      await deleteProfessional(id);
      await loadProfessionals();
      showNotification('Professional deleted successfully', 'success');
    } catch (error) {
      showNotification('Failed to delete professional.', 'error');
    }
  }, [loadProfessionals, showNotification]);

  const handleProfessionalMediaChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, projectType: 'new' | 'edit') => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      if (projectType === 'new') {
        setNewProfessional((prevProfessional) => ({ ...prevProfessional, media: [...prevProfessional.media, ...selectedFiles] }));
      } else if (editProfessional) {
        setEditProfessional((prevProfessional) => ({ ...prevProfessional!, media: [...prevProfessional!.media, ...selectedFiles] }));
      }
    }
  }, [editProfessional]);

  const removeProfessionalMedia = useCallback((projectType: 'new' | 'edit', index: number) => {
    if (projectType === 'new') {
      setNewProfessional((prevProfessional) => ({ ...prevProfessional, media: prevProfessional.media.filter((_, i) => i !== index) }));
    } else if (editProfessional) {
      setEditProfessional((prevProfessional) => ({ ...prevProfessional!, media: prevProfessional!.media.filter((_, i) => i !== index) }));
    }
  }, [editProfessional]);

  // Memoize context value
  const contextValue = useMemo(() => ({
    projects, professionals, newProject, newProfessional,
    experienceWord, setExperienceWord, handleSaveExperienceWord,
    setNewProject, setNewProfessional,
    handleAddOrUpdateProject, handleAddOrUpdateProfessional,
    handleDeleteProject, handleDeleteProfessional,
    handleProjectMediaChange, handleProfessionalMediaChange,
    isNewProjectVisible, isNewProfessionalVisible,
    setIsNewProjectVisible, setIsNewProfessionalVisible,
    editProject, editProfessional,
    setEditProject, setEditProfessional,
    removeProjectMedia, removeProfessionalMedia,
  }), [
    projects, professionals, newProject, newProfessional,
    experienceWord, editProject, editProfessional,
    isNewProjectVisible, isNewProfessionalVisible,
    handleAddOrUpdateProfessional, handleAddOrUpdateProject,
    handleDeleteProfessional, handleDeleteProject,
    handleProfessionalMediaChange, handleProjectMediaChange,
    handleSaveExperienceWord, removeProfessionalMedia, removeProjectMedia
  ]);

  // Load data on mount
  useEffect(() => {
    if (!hasFetched.current) {
      loadProjects();
      loadProfessionals();
      fetchExperienceWords();
      hasFetched.current = true;
    }
  }, [loadProjects, loadProfessionals, fetchExperienceWords]);

  return <ExperiencesContext.Provider value={contextValue}>{children}</ExperiencesContext.Provider>;
};
