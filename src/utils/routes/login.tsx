import axios from 'axios';

// Function to handle login route API request with error handling
export const loginRoute = async (account: string, password: string) => {
  try {
    // Use NEXT_PUBLIC_API_URL for API calls
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
      account,
      password,
    });
    return response.data;
  } catch (err) {
    const error = err as any;
    // Throw an error with a specific message for further handling
    throw new Error(error.response?.data?.error || 'Login request failed.');
  }
};
