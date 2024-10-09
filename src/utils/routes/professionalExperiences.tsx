import axios, { AxiosError } from 'axios';

// Type definition for the professional object
export type Professional = {
  id: string;
  title: string;
  startTime: string | null;
  endTime: string | null;
  skills: string | null;
  company: string | null;
  description: string | null;
  media: string[]; // Array of media URLs (pictures/videos)
};

// Fetch all professionals
export const fetchProfessionals = async (): Promise<Professional[] | null> => {
  try {
    const { data } = await axios.get<Professional[]>(`${process.env.NEXT_PUBLIC_API_URL}/api/professionals`);
    return data;
  } catch (error) {
    handleAxiosError(error, 'Failed to fetch professionals.');
    return null; // Returning null in case of an error
  }
};

// Add a new professional with media files
export const addProfessional = async (professional: Partial<Professional>, mediaFiles: File[]): Promise<Professional | null> => {
  try {
    const formData = createProfessionalFormData(professional, mediaFiles);
    const { data } = await axios.post<Professional>(`${process.env.NEXT_PUBLIC_API_URL}/api/professionals`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  } catch (error) {
    handleAxiosError(error, 'Failed to add professional.');
    return null; // Returning null in case of an error
  }
};

// Update an existing professional by ID with media files
export const updateProfessional = async (id: string, professional: Partial<Professional>, mediaFiles: (File | string)[]): Promise<Professional | null> => {
  try {
    const formData = createProfessionalFormData(professional, mediaFiles);

    // Separate blob URLs from valid URLs
    const { blobUrls, validMediaUrls } = separateMediaUrls(professional.media || []);

    // Add existing media URLs to formData
    if (validMediaUrls.length > 0) {
      formData.append('existingMedia', JSON.stringify(validMediaUrls));
    }

    // Convert blob URLs into File objects and append them
    await appendBlobUrlsToFormData(blobUrls, formData);

    // Make the PUT request to update the professional
    const { data } = await axios.put<Professional>(`${process.env.NEXT_PUBLIC_API_URL}/api/professionals/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return data;
  } catch (error) {
    handleAxiosError(error, 'Failed to update professional.');
    return null; // Returning null in case of an error
  }
};

// Delete a professional by ID
export const deleteProfessional = async (id: string): Promise<boolean> => {
  try {
    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/professionals/${id}`);
    return true;
  } catch (error) {
    handleAxiosError(error, 'Failed to delete professional.');
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

// Helper function to create formData for professionals
const createProfessionalFormData = (professional: Partial<Professional>, mediaFiles: (File | string)[]): FormData => {
  const formData = new FormData();
  formData.append('id', professional.id || '');
  formData.append('title', professional.title || '');
  formData.append('startTime', professional.startTime || '');
  formData.append('endTime', professional.endTime || '');
  formData.append('skills', professional.skills || '');
  formData.append('company', professional.company || '');
  formData.append('description', professional.description || '');

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
