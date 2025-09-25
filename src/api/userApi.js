import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const BASE_URL = 'https://askrashid.grahak.online/api/UserAccount';

export const registerUser = async (payload) => {
  try {
    const response = await axios.post(`${BASE_URL}/UserRegistration`, payload, {
      headers: { 
        'Content-Type': 'application/json',
       },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const changePassword = async (oldPassword, newPassword, confirmPassword) => {
  const email = await AsyncStorage.getItem('email');  

  const url = `${BASE_URL}/ChangePasswordbyEmail?email=${encodeURIComponent(email)}&oldPassword=${encodeURIComponent(oldPassword)}&newPassword=${encodeURIComponent(newPassword)}&confirmPassword=${encodeURIComponent(confirmPassword)}`;

  const response = await axios.post(url);
  return response.data;
  
};