import axios, { AxiosError } from 'axios';

// Type definition for the project object
export type Project = {
  id: string;
  title: string;
  startTime: string | null;
  endTime: string | null;
  skills: string | null;
  link: string | null;
  description: string | null;
  media: string[]; // Array of media URLs (pictures/videos)
};

// Fetch all projects
export const fetchProjects = async (): Promise<Project[] | null> => {
  try {
    const { data } = await axios.get<Project[]>(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`);
    return data;
  } catch (error) {
    handleAxiosError(error, 'Failed to fetch projects.');
    return null; // Returning null in case of an error
  }
};

// Add a new project with media files
export const addProject = async (project: Partial<Project>, mediaFiles: File[]): Promise<Project | null> => {
  try {
    const formData = createProjectFormData(project, mediaFiles);
    const { data } = await axios.post<Project>(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  } catch (error) {
    handleAxiosError(error, 'Failed to add project.');
    return null; // Returning null in case of an error
  }
};

// Update an existing project by ID with media files
export const updateProject = async (id: string, project: Partial<Project>, mediaFiles: (File | string)[]): Promise<Project | null> => {
  try {
    const formData = createProjectFormData(project, mediaFiles);

    // Separate blob URLs from valid URLs
    const { blobUrls, validMediaUrls } = separateMediaUrls(project.media || []);

    // Add existing media URLs to formData
    if (validMediaUrls.length > 0) {
      formData.append('existingMedia', JSON.stringify(validMediaUrls));
    }

    // Convert blob URLs into File objects and append them
    await appendBlobUrlsToFormData(blobUrls, formData);
    console.log(project, '||', mediaFiles)
    // Make the PUT request to update the project
    const { data } = await axios.put<Project>(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return data;
  } catch (error) {
    handleAxiosError(error, 'Failed to update project.');
    return null; // Returning null in case of an error
  }
};

// Delete a project by ID
export const deleteProject = async (id: string): Promise<boolean> => {
  try {
    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${id}`);
    return true;
  } catch (error) {
    handleAxiosError(error, 'Failed to delete project.');
    return false; // Returning false in case of an error
  }
};

// Helper function to handle Axios errors
const handleAxiosError = (error: unknown, defaultMessage: string): void => {
  if (error instanceof AxiosError) {
    console.error(error.response?.data?.error || defaultMessage);
  } else {
    console.error('An unexpected error occurred.');
  }
};

// Helper function to create formData for projects
const createProjectFormData = (project: Partial<Project>, mediaFiles: (File | string)[]): FormData => {
  const formData = new FormData();
  formData.append('id', project.id || '');
  formData.append('title', project.title || '');
  formData.append('startTime', project.startTime || '');
  formData.append('endTime', project.endTime || '');
  formData.append('skills', project.skills || '');
  formData.append('link', project.link || '');
  formData.append('description', project.description || '');
  // Append media files to formData
  mediaFiles.forEach((file) => {
    if (typeof file !== 'string') {
      formData.append('media', file);
    }
  });

  return formData;
};

// Utility function to fetch blob URLs and convert them into File objects
const fetchBlobAsFile = async (blobUrl: string, fileName: string): Promise<File | null> => {
  try {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    return new File([blob], fileName, { type: blob.type });
  } catch (error) {
    console.error(`Failed to fetch blob as file: ${error}`);
    return null; // Return null if fetching blob fails
  }
};

// Helper function to separate blob and valid media URLs
const separateMediaUrls = (media: string[]): { blobUrls: string[]; validMediaUrls: string[] } => {
  const blobUrls = media.filter((url) => url.startsWith('blob:'));
  const validMediaUrls = media.filter((url) => !url.startsWith('blob:'));
  return { blobUrls, validMediaUrls };
};

// Helper function to append blob URLs as File objects to formData
const appendBlobUrlsToFormData = async (blobUrls: string[], formData: FormData): Promise<void> => {
  for (const blobUrl of blobUrls) {
    const fileName = `media-${Date.now()}.jpg`; // Generate file name for blob
    const file = await fetchBlobAsFile(blobUrl, fileName);
    if (file) {
      formData.append('media', file);
    }
  }
};
