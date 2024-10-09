import axios from 'axios';

// Add a new experience word
export const addExperienceWord = async (
  word: { id: string; title: string; description: string }
): Promise<void> => {
  try {
    // Send JSON data instead of FormData
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/experiencewords`, word, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to add experience word:', error);
    throw new Error('Failed to add experience word.');
  }
};

// Fetch all experience words
export const getExperienceWords = async (): Promise<any[]> => {
  try {
    // Use environment variable for the full API URL
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/experiencewords`);
    return response.data.words; // Assuming backend returns { words: [...] }
  } catch (error) {
    console.error('Failed to fetch experience words:', error);
    throw new Error('Failed to fetch experience words.');
  }
};

// Update an existing experience word
export const updateExperienceWord = async (
  id: string,
  word: { title: string; description: string }
): Promise<void> => {
  try {
    // Send JSON data instead of FormData
    await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/experiencewords/${id}`, word, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to update experience word:', error);
    throw new Error('Failed to update experience word.');
  }
};
