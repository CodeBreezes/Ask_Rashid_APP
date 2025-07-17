// 📁 src/api/serviceApi.js
import axios from 'axios';

const BASE_URL = 'http://appointment.bitprosofttech.com/api';

export const getServices = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/Services`);
    return response.data;
    debugger;
  } catch (error) {
    console.error('Error fetching services:', error.message);
    throw error;
  }
};
