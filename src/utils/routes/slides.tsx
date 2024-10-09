import axios from 'axios';

// Uploads the form data to the server using Next.js API routes.
export const uploadSlide = async (formData: FormData): Promise<void> => {
  try {
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/slides`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  } catch (error) {
    throw new Error('Failed to upload file.');
  }
};

// Fetches all slide pictures from the server using Next.js API routes.
export const getSlidePictures = async (): Promise<any[]> => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/slides`);
    return response.data.pictures; // Assuming the backend sends { pictures: [...] }
  } catch (error) {
    throw new Error('Failed to fetch slide pictures.');
  }
};

// Deletes a slide picture by name using Next.js API routes.
export const deleteSlidePicture = async (name: string): Promise<void> => {
  try {
    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/slides/${name}`);
  } catch (error) {
    throw new Error('Failed to delete slide picture.');
  }
};
