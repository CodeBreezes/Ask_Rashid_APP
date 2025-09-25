// 📁 src/api/serviceApi.js
import axios from 'axios';

const BASE_URL = 'https://askrashid.grahak.online/api';

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
