import axios from 'axios';

// Add a new contact entry
export const addContactEntry = async (entry: { id: string; phone: string; email: string; linkedin: string; github: string }): Promise<void> => {
  try {
    // Send JSON data instead of FormData
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, entry, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to add contact entry:', error);
    throw new Error('Failed to add contact entry.');
  }
};

// Fetch all contact entries
export const getContactEntries = async (): Promise<any[]> => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`);
    return response.data.contact; // Assuming backend returns { contact: [...] }
  } catch (error) {
    console.error('Failed to fetch contact entries:', error);
    throw new Error('Failed to fetch contact entries.');
  }
};

// Update an existing contact entry
export const updateContactEntry = async (id: string, entry: { phone: string; email: string; linkedin: string; github: string }): Promise<void> => {
  try {
    // Send JSON data instead of FormData
    await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/contact/${id}`, entry, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to update contact entry:', error);
    throw new Error('Failed to update contact entry.');
  }
};
