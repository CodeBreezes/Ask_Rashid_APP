

import axios from 'axios';

const BASE_URL = 'https://askrashid.grahak.online/api/UserAccount';

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${BASE_URL}/Login`, credentials);
    return response;
  } catch (error) {
    throw error;
  }
};

export const checkEmailExists = async (email) => {
  try {
    const response = await axios.get(
      `https://askrashid.grahak.online/api/UserAccount/CheckEmailExists`,
      {
        params: { email }, 
      }
    );

    return response.data; 
  } catch (error) {
    console.error("Error checking email:", error.response?.data || error.message);
    throw error;
  }
};


export const getUserByEmail = async (email) => {
  try {
    const response = await axios.get(
      `https://askrashid.grahak.online/api/Services/GetUserByEmail`,
      {
        params: { email },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Get user failed:', error?.response?.data || error.message);
    return null;
  }
};
