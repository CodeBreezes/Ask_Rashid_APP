

import axios from 'axios';

const BASE_URL = 'http://appointment.bitprosofttech.com/api/UserAccount';

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
    const response = await axios.post(
      'http://appointment.bitprosofttech.com/api/UserAccount/CheckEmailExists',
      JSON.stringify(email), 
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data; 
  } catch (error) {
    console.error('Email check failed:', error?.response?.data || error.message);
    return false;
  }
};



export const getUserByEmail = async (email) => {
  try {
    const response = await axios.get(
      `http://appointment.bitprosofttech.com/api/Services/GetUserByEmail`,
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
