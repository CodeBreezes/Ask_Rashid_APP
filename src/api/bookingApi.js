// bookingApi.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://appointment.bitprosofttech.com/api';

// ✅ Post a new booking
export const postBooking = async (bookingData) => {
  try {
    const token = await AsyncStorage.getItem('token');

    const response = await axios.post(`${BASE_URL}/Bookings`, bookingData, {
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

    const response = await axios.get(`${BASE_URL}/Bookings`, {
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
