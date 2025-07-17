import axios from 'axios';

const BASE_URL = 'http://appointment.bitprosofttech.com/api/UserAccount';

export const registerUser = async (payload) => {
  try {
    const response = await axios.post(`${BASE_URL}/UserRegistration`, payload, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response;
  } catch (error) {
    throw error;
  }
};
