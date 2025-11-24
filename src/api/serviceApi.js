// 📁 src/api/serviceApi.js
import axios from 'axios';
import { BASE_URL } from './apiConfig';

export const getServices = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/Services`);
    return response.data;
    debugger;
  } catch (error) {
    console.error('Error fetching services:', error.message);
    throw error;
  }
};
