// api/loginApi.js

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
