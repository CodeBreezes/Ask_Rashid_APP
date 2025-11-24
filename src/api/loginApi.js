

import axios from 'axios';
import { BASE_API_URL } from './apiConfig';

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${BASE_API_URL}/api/UserAccount/Login`, credentials);
    return response;
  } catch (error) {
    throw error;
  }
};

export const checkEmailExists = async (email) => {
  try {
    const response = await axios.get(
      `${BASE_API_URL}/api/UserAccount/CheckEmailExists`,
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

export const CheckIfLoginFromGoogle = async (email) => {
  try {
    const response = await axios.get(
      `${BASE_API_URL}/api/UserAccount/CheckIfLoginFromGoogle`,
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
      `${BASE_API_URL}/api/Services/GetUserByEmail`,
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
