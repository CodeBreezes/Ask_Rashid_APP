// bookingApi.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_API_URL } from './apiConfig';

// ✅ Post a new booking
export const postBooking = async (bookingData) => {
  try {
    const token = await AsyncStorage.getItem('token');

    const response = await axios.post(`${BASE_API_URL}/api/Bookings`, bookingData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
debugger;
    return response;
  } catch (error) {
    throw error;
  }
};

// ✅ Get all bookings with token authorization
export const getAllBookings = async () => {
  try {
    const token = await AsyncStorage.getItem('token');

    const response = await axios.get(`${BASE_API_URL}/api/Bookings`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
};
