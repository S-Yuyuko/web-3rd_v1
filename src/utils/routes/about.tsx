import axios from 'axios';

// Add a new about entry
export const addAboutEntry = async (entry: { id: string; information: string; skills: string; education: string }): Promise<void> => {
  try {
    // Send JSON data instead of FormData
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/about`, entry, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to add about entry:', error);
    throw new Error('Failed to add about entry.');
  }
};

// Fetch all about entries
export const getAboutEntries = async (): Promise<any[]> => {
  try {
    // Use NEXT_PUBLIC_API_URL for API calls
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/about`);
    return response.data.about; // Assuming backend returns { about: [...] }
  } catch (error) {
    throw new Error('Failed to fetch about entries.');
  }
};

// Update an existing about entry
export const updateAboutEntry = async (id: string, entry: { information: string; skills: string; education: string }): Promise<void> => {
  try {
    // Send JSON data instead of FormData
    await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/about/${id}`, entry, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to update about entry:', error);
    throw new Error('Failed to update about entry.');
  }
};
